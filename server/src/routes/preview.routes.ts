import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// GET /api/preview/layout?route=/rewards&viewport=desktop&tenantCode=kaiser&cohortCode=default&status=draft
router.get("/layout", async (req: Request, res: Response) => {
  const { route, viewport, tenantCode, cohortCode, status } = req.query;
  if (!route || !viewport || !tenantCode) {
    res.status(400).json({ error: "route, viewport, and tenantCode query params required" });
    return;
  }

  const routeRecord = await prisma.route.findUnique({ where: { path: route as string } });
  if (!routeRecord) {
    res.status(404).json({ error: "Route not found" });
    return;
  }

  const tenant = await prisma.tenant.findUnique({ where: { code: tenantCode as string } });
  if (!tenant) {
    res.status(404).json({ error: "Tenant not found" });
    return;
  }

  // Resolution chain: requested cohort → "default" cohort (case insensitive)
  const cc = (cohortCode as string)?.toLowerCase() || "default";
  const cohortCodes = cc !== "default" ? [cc, "default"] : ["default"];

  const statusToTry = (status as string) === "draft" ? ["draft", "published"] : ["published"];

  for (const cc of cohortCodes) {
    const cohort = await prisma.cohort.findUnique({
      where: { tenantId_code: { tenantId: tenant.id, code: cc } },
    });
    if (!cohort) continue;

    for (const s of statusToTry) {
      const layout = await prisma.pageLayout.findUnique({
        where: {
          routeId_tenantId_cohortId_viewport_status: {
            routeId: routeRecord.id,
            tenantId: tenant.id,
            cohortId: cohort.id,
            viewport: viewport as string,
            status: s,
          },
        },
      });
      if (layout) {
        const isFallback = cc !== (cohortCode as string);
        res.json({
          data: JSON.parse(layout.layoutJson),
          status: s,
          ...(isFallback ? { fallbackCohort: "default" } : {}),
        });
        return;
      }
    }
  }

  // Fallback: use /my-card route's layout as template
  const templateRoute = await prisma.route.findUnique({ where: { path: "/my-card" } });
  if (templateRoute) {
    const defaultCohort = await prisma.cohort.findFirst({
      where: { tenantId: tenant.id, code: "default" },
    });
    if (defaultCohort) {
      for (const s of statusToTry) {
        const templateLayout = await prisma.pageLayout.findUnique({
          where: {
            routeId_tenantId_cohortId_viewport_status: {
              routeId: templateRoute.id,
              tenantId: tenant.id,
              cohortId: defaultCohort.id,
              viewport: viewport as string,
              status: s,
            },
          },
        });
        if (templateLayout) {
          res.json({ data: JSON.parse(templateLayout.layoutJson), status: s, template: true });
          return;
        }
      }
    }
  }

  res.status(404).json({ error: "No layout found" });
});

export default router;
