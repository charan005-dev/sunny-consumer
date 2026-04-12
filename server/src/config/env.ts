import "dotenv/config";

export const env = {
  port: parseInt(process.env.PORT || "3001", 10),
  databaseUrl: process.env.DATABASE_URL!,
  auth0IssuerBaseUrl: process.env.AUTH0_ISSUER_BASE_URL!,
  auth0Audience: process.env.AUTH0_AUDIENCE!,
  devBypassAuth: process.env.DEV_BYPASS_AUTH === "true",
  consoleUrl: process.env.CONSOLE_URL || "http://localhost:5173",
  consumerUrl: process.env.CONSUMER_URL || "http://localhost:5174",
};
