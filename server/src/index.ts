import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { checkJwt, extractTenantContext } from "./middleware/auth.js";
import tenantsRouter from "./routes/tenants.routes.js";
import routesRouter from "./routes/routes.routes.js";
import componentsRouter from "./routes/components.routes.js";
import layoutsRouter from "./routes/layouts.routes.js";
import previewRouter from "./routes/preview.routes.js";

const app = express();

app.use(helmet());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    env.consoleUrl,
    env.consumerUrl,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

// Health check (no auth)
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Preview endpoint (no auth — used by console iframe)
app.use("/api/preview", previewRouter);

// All other routes require JWT (or dev bypass)
app.use("/api", checkJwt, extractTenantContext);

// Mount route handlers — layouts router handles both /api/layouts/* and /api/consumer/*
app.use("/api/tenants", tenantsRouter);
app.use("/api/routes", routesRouter);
app.use("/api/components", componentsRouter);
app.use("/api", layoutsRouter);

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

app.listen(env.port, () => {
  console.log(`API server running on http://localhost:${env.port}`);
  if (env.devBypassAuth) {
    console.log("⚠️  Auth0 bypass enabled (DEV mode). Use X-Dev-Tenant/X-Dev-Cohort/X-Dev-Role headers.");
  }
});
