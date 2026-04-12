import "express";

declare module "express" {
  interface Request {
    tenantCode?: string;
    cohortCode?: string;
    userRole?: string;
    auth?: {
      payload: Record<string, unknown>;
    };
  }
}
