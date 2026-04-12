export const AUTH0_NAMESPACE = "https://layout-builder.local";

export interface AuthUser {
  sub: string;
  email?: string;
  tenantCode?: string;
  cohortCode?: string;
  role?: string;
}
