import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = Router();

// Helper: parse JSON string fields in slot definitions
function parseSlotDef(sd: Record<string, unknown>) {
  return {
    ...sd,
    allowedSlotTypes: JSON.parse(sd.allowedSlotTypes as string),
    viewports: JSON.parse(sd.viewports as string),
  };
}

function parseRoute(route: Record<string, unknown> & { slotDefinitions?: Record<string, unknown>[] }) {
  if (route.slotDefinitions) {
    return { ...route, slotDefinitions: route.slotDefinitions.map(parseSlotDef) };
  }
  return route;
}

// GET /api/routes
router.get("/", async (_req: Request, res: Response) => {
  const routes = await prisma.route.findMany({
    include: { slotDefinitions: { orderBy: { sortOrder: "asc" } } },
    orderBy: { name: "asc" },
  });
  res.json({ data: routes.map((r) => parseRoute(r as unknown as Record<string, unknown> & { slotDefinitions: Record<string, unknown>[] })) });
});

// POST /api/routes
router.post("/", requireAdmin, async (req: Request, res: Response) => {
  const { path, name, description } = req.body;
  const route = await prisma.route.create({
    data: { path, name, description },
  });
  res.status(201).json({ data: route });
});

// GET /api/routes/:id
router.get("/:id", async (req: Request, res: Response) => {
  const route = await prisma.route.findUnique({
    where: { id: req.params.id },
    include: { slotDefinitions: { orderBy: { sortOrder: "asc" } } },
  });
  if (!route) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ data: parseRoute(route as unknown as Record<string, unknown> & { slotDefinitions: Record<string, unknown>[] }) });
});

// PUT /api/routes/:id
router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  const { name, description, isActive } = req.body;
  const route = await prisma.route.update({
    where: { id: req.params.id },
    data: { name, description, isActive },
  });
  res.json({ data: route });
});

// GET /api/routes/:routeId/slots
router.get("/:routeId/slots", async (req: Request, res: Response) => {
  const slots = await prisma.slotDefinition.findMany({
    where: { routeId: req.params.routeId },
    orderBy: { sortOrder: "asc" },
  });
  res.json({ data: slots.map((s) => parseSlotDef(s as unknown as Record<string, unknown>)) });
});

// POST /api/routes/:routeId/slots
router.post("/:routeId/slots", requireAdmin, async (req: Request, res: Response) => {
  const { slotKey, name, allowedSlotTypes, required, sortOrder, viewports } = req.body;
  const slot = await prisma.slotDefinition.create({
    data: {
      routeId: req.params.routeId,
      slotKey,
      name,
      allowedSlotTypes: JSON.stringify(allowedSlotTypes),
      required: required ?? false,
      sortOrder: sortOrder ?? 0,
      viewports: JSON.stringify(viewports ?? ["desktop", "mobile"]),
    },
  });
  res.status(201).json({ data: parseSlotDef(slot as unknown as Record<string, unknown>) });
});

export default router;
