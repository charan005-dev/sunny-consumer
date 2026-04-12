import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = Router();

// Helper: parse JSON string fields
function parseComponent(comp: Record<string, unknown>) {
  return {
    ...comp,
    defaultProps: comp.defaultProps ? JSON.parse(comp.defaultProps as string) : null,
    propsSchema: comp.propsSchema ? JSON.parse(comp.propsSchema as string) : null,
  };
}

// GET /api/components
router.get("/", async (req: Request, res: Response) => {
  const where = req.query.slotType
    ? { slotType: req.query.slotType as string }
    : {};
  const components = await prisma.componentRegistryEntry.findMany({
    where,
    orderBy: [{ slotType: "asc" }, { name: "asc" }],
  });
  res.json({ data: components.map((c) => parseComponent(c as unknown as Record<string, unknown>)) });
});

// POST /api/components
router.post("/", requireAdmin, async (req: Request, res: Response) => {
  const { code, name, description, slotType, thumbnailUrl, defaultProps, propsSchema } = req.body;
  const component = await prisma.componentRegistryEntry.create({
    data: {
      code,
      name,
      description,
      slotType,
      thumbnailUrl,
      defaultProps: defaultProps ? JSON.stringify(defaultProps) : null,
      propsSchema: propsSchema ? JSON.stringify(propsSchema) : null,
    },
  });
  res.status(201).json({ data: parseComponent(component as unknown as Record<string, unknown>) });
});

// PUT /api/components/:id
router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  const { name, description, slotType, thumbnailUrl, defaultProps, propsSchema } = req.body;
  const component = await prisma.componentRegistryEntry.update({
    where: { id: req.params.id },
    data: {
      name,
      description,
      slotType,
      thumbnailUrl,
      defaultProps: defaultProps ? JSON.stringify(defaultProps) : null,
      propsSchema: propsSchema ? JSON.stringify(propsSchema) : null,
    },
  });
  res.json({ data: parseComponent(component as unknown as Record<string, unknown>) });
});

export default router;
