import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = Router();

// Helper: parse layoutJson from SQLite string
function parseLayout(layout: { layoutJson: string; [key: string]: unknown }) {
  return { ...layout, layoutJson: JSON.parse(layout.layoutJson as string) };
}

// GET /api/layouts (admin - list all, with filters)
router.get("/layouts", async (req: Request, res: Response) => {
  const { routeId, tenantId, cohortId, viewport, status } = req.query;
  const where: Record<string, unknown> = {};
  if (routeId) where.routeId = routeId;
  if (tenantId) where.tenantId = tenantId;
  if (cohortId) where.cohortId = cohortId;
  if (viewport) where.viewport = viewport;
  if (status) where.status = status;

  const layouts = await prisma.pageLayout.findMany({
    where,
    include: { route: true, tenant: true, cohort: true },
    orderBy: { updatedAt: "desc" },
  });
  res.json({ data: layouts.map(parseLayout) });
});

// POST /api/layouts (create draft)
router.post("/layouts", requireAdmin, async (req: Request, res: Response) => {
  const { routeId, tenantId, cohortId, viewport, layoutJson } = req.body;
  const layout = await prisma.pageLayout.create({
    data: {
      routeId,
      tenantId,
      cohortId,
      viewport,
      layoutJson: JSON.stringify(layoutJson),
      status: "draft",
    },
  });
  res.status(201).json({ data: parseLayout(layout) });
});

// GET /api/layouts/:id
router.get("/layouts/:id", async (req: Request, res: Response) => {
  const layout = await prisma.pageLayout.findUnique({
    where: { id: req.params.id },
    include: { route: true, tenant: true, cohort: true },
  });
  if (!layout) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ data: parseLayout(layout) });
});

// PUT /api/layouts/:id (update draft only)
router.put("/layouts/:id", requireAdmin, async (req: Request, res: Response) => {
  const existing = await prisma.pageLayout.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (existing.status !== "draft") {
    res.status(400).json({ error: "Cannot edit a published layout. Edit the draft instead." });
    return;
  }
  const { layoutJson } = req.body;
  const layout = await prisma.pageLayout.update({
    where: { id: req.params.id },
    data: { layoutJson: JSON.stringify(layoutJson) },
  });
  res.json({ data: parseLayout(layout) });
});

// POST /api/layouts/:id/publish
router.post("/layouts/:id/publish", requireAdmin, async (req: Request, res: Response) => {
  const draft = await prisma.pageLayout.findUnique({ where: { id: req.params.id } });
  if (!draft) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (draft.status !== "draft") {
    res.status(400).json({ error: "Only draft layouts can be published" });
    return;
  }

  const published = await prisma.$transaction(async (tx) => {
    const existingPublished = await tx.pageLayout.findUnique({
      where: {
        routeId_tenantId_cohortId_viewport_status: {
          routeId: draft.routeId,
          tenantId: draft.tenantId,
          cohortId: draft.cohortId,
          viewport: draft.viewport,
          status: "published",
        },
      },
    });

    if (existingPublished) {
      return tx.pageLayout.update({
        where: { id: existingPublished.id },
        data: {
          layoutJson: draft.layoutJson,
          version: existingPublished.version + 1,
          publishedAt: new Date(),
          publishedBy: (req.auth?.payload?.sub as string) || "unknown",
        },
      });
    } else {
      return tx.pageLayout.create({
        data: {
          routeId: draft.routeId,
          tenantId: draft.tenantId,
          cohortId: draft.cohortId,
          viewport: draft.viewport,
          layoutJson: draft.layoutJson,
          status: "published",
          version: 1,
          publishedAt: new Date(),
          publishedBy: (req.auth?.payload?.sub as string) || "unknown",
        },
      });
    }
  });

  res.json({ data: parseLayout(published) });
});

// POST /api/layouts/:id/revert
router.post("/layouts/:id/revert", requireAdmin, async (req: Request, res: Response) => {
  const draft = await prisma.pageLayout.findUnique({ where: { id: req.params.id } });
  if (!draft || draft.status !== "draft") {
    res.status(400).json({ error: "Can only revert a draft layout" });
    return;
  }

  const published = await prisma.pageLayout.findUnique({
    where: {
      routeId_tenantId_cohortId_viewport_status: {
        routeId: draft.routeId,
        tenantId: draft.tenantId,
        cohortId: draft.cohortId,
        viewport: draft.viewport,
        status: "published",
      },
    },
  });

  if (!published) {
    res.status(404).json({ error: "No published version to revert to" });
    return;
  }

  const reverted = await prisma.pageLayout.update({
    where: { id: draft.id },
    data: { layoutJson: published.layoutJson },
  });
  res.json({ data: parseLayout(reverted) });
});

// ===== CONSUMER ENDPOINT =====
// GET /api/consumer/layout?route=/rewards&viewport=desktop
router.get("/consumer/layout", async (req: Request, res: Response) => {
  const { route, viewport } = req.query;
  if (!route || !viewport) {
    res.status(400).json({ error: "route and viewport query params required" });
    return;
  }

  const tenantCode = req.tenantCode;
  const cohortCode = req.cohortCode;

  console.log("[consumer/layout]", { route, viewport, tenantCode, cohortCode, hasAuth: !!req.auth });

  if (!tenantCode) {
    console.log("[consumer/layout] ERROR: No tenant_code. Token payload:", JSON.stringify(req.auth?.payload, null, 2));
    res.status(400).json({ error: "No tenant_code found in token" });
    return;
  }

  const routeRecord = await prisma.route.findUnique({ where: { path: route as string } });
  if (!routeRecord) {
    res.status(404).json({ error: "Route not found" });
    return;
  }

  const tenant = await prisma.tenant.findUnique({ where: { code: tenantCode } });
  if (!tenant) {
    res.status(404).json({ error: "Tenant not found" });
    return;
  }

  // Resolution chain: exact cohort → "default" cohort (case insensitive)
  const normalizedCohort = cohortCode?.toLowerCase();
  const cohortCodes = normalizedCohort && normalizedCohort !== "default" ? [normalizedCohort, "default"] : ["default"];

  for (const cc of cohortCodes) {
    const cohort = await prisma.cohort.findUnique({
      where: { tenantId_code: { tenantId: tenant.id, code: cc } },
    });
    if (!cohort) continue;

    const layout = await prisma.pageLayout.findUnique({
      where: {
        routeId_tenantId_cohortId_viewport_status: {
          routeId: routeRecord.id,
          tenantId: tenant.id,
          cohortId: cohort.id,
          viewport: viewport as string,
          status: "published",
        },
      },
    });

    if (layout) {
      res.json({ data: JSON.parse(layout.layoutJson) });
      return;
    }
  }

  res.status(404).json({ error: "No published layout found" });
});

export default router;
