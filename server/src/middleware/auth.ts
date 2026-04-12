import { auth } from "express-oauth2-jwt-bearer";
import { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

const AUTH0_NAMESPACE = "https://layout-builder.local";

// Real Auth0 JWT validation middleware
const jwtCheck = env.devBypassAuth
  ? null
  : auth({
      audience: env.auth0Audience,
      issuerBaseURL: env.auth0IssuerBaseUrl,
      tokenSigningAlg: "RS256",
    });

// Dev bypass middleware that simulates Auth0 token claims
function devBypass(req: Request, _res: Response, next: NextFunction): void {
  // Check for X-Dev-Tenant and X-Dev-Cohort headers for easy testing
  const tenantCode = req.headers["x-dev-tenant"] as string || "kaiser";
  const cohortCode = req.headers["x-dev-cohort"] as string || "default";
  const role = req.headers["x-dev-role"] as string || "admin";

  req.auth = {
    payload: {
      sub: "dev-user",
      [`${AUTH0_NAMESPACE}/tenant_code`]: tenantCode,
      [`${AUTH0_NAMESPACE}/cohort_code`]: cohortCode,
      [`${AUTH0_NAMESPACE}/role`]: role,
    },
  };
  next();
}

export function checkJwt(req: Request, res: Response, next: NextFunction): void {
  if (env.devBypassAuth) {
    devBypass(req, res, next);
  } else {
    jwtCheck!(req, res, next);
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const role = req.auth?.payload[`${AUTH0_NAMESPACE}/role`] as string | undefined;
  if (role !== "admin") {
    res.status(403).json({ error: "Forbidden", message: "Admin access required" });
    return;
  }
  next();
}

export function extractTenantContext(req: Request, _res: Response, next: NextFunction): void {
  const payload = req.auth?.payload;
  if (payload) {
    req.tenantCode = (payload[`${AUTH0_NAMESPACE}/tenant_code`] as string | undefined)?.toLowerCase();
    req.cohortCode = (payload[`${AUTH0_NAMESPACE}/cohort_code`] as string | undefined)?.toLowerCase();
    req.userRole = payload[`${AUTH0_NAMESPACE}/role`] as string | undefined;
  }
  next();
}
