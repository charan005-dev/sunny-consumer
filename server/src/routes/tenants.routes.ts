import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = Router();

// GET /api/tenants
router.get("/", async (_req: Request, res: Response) => {
  const tenants = await prisma.tenant.findMany({
    orderBy: { name: "asc" },
  });
  res.json({ data: tenants });
});

// POST /api/tenants
router.post("/", requireAdmin, async (req: Request, res: Response) => {
  const { code, name } = req.body;
  const tenant = await prisma.tenant.create({
    data: { code, name },
  });
  res.status(201).json({ data: tenant });
});

// GET /api/tenants/:id
router.get("/:id", async (req: Request, res: Response) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: req.params.id },
  });
  if (!tenant) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ data: tenant });
});

// PUT /api/tenants/:id
router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  const { name, isActive } = req.body;
  const tenant = await prisma.tenant.update({
    where: { id: req.params.id },
    data: { name, isActive },
  });
  res.json({ data: tenant });
});

// GET /api/tenants/:id/cohorts
router.get("/:id/cohorts", async (req: Request, res: Response) => {
  const cohorts = await prisma.cohort.findMany({
    where: { tenantId: req.params.id },
    orderBy: { name: "asc" },
  });
  res.json({ data: cohorts });
});

// POST /api/tenants/:id/cohorts
router.post("/:id/cohorts", requireAdmin, async (req: Request, res: Response) => {
  const { code, name, description } = req.body;
  const cohort = await prisma.cohort.create({
    data: { code, name, description, tenantId: req.params.id },
  });
  res.status(201).json({ data: cohort });
});

export default router;
