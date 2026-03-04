import type { Express, RequestHandler } from "express";

let authConfigured = false;

function isAuthDisabled() {
  return process.env.AUTH_DISABLED === "true";
}

function hasReplitEnv() {
  return Boolean(process.env.REPLIT_DOMAINS && process.env.REPLIT_CLIENT_ID);
}

/**
 * Setup auth.
 * - If AUTH_DISABLED=true OR missing Replit env vars, we safely no-op for local dev.
 * - If Replit env vars exist, we load the real Replit auth implementation.
 */
export async function setupAuth(app: Express) {
  if (isAuthDisabled() || !hasReplitEnv()) {
    authConfigured = false;

    // Provide minimal stubs so code that checks req.isAuthenticated won't crash.
    app.use((req: any, _res, next) => {
      if (typeof req.isAuthenticated !== "function") {
        req.isAuthenticated = () => false;
      }
      next();
    });

    return;
  }

  authConfigured = true;

  // Lazy import so local dev doesn't require openid-client config
  const mod = await import("./replitAuth.real");
  return mod.setupAuth(app);
}

/**
 * Middleware:
 * - If auth is disabled/unconfigured, block endpoints that require auth with 401.
 * - If auth is configured, defer to the real middleware.
 */
export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  if (!authConfigured) {
    return res.status(401).json({ message: "Authentication not enabled in this environment." });
  }

  const mod = await import("./replitAuth.real");
  return mod.isAuthenticated(req, res, next);
};