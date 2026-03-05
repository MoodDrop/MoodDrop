// server/index.ts
import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Request logging (only logs /api calls)
 */
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson as any;
    return originalResJson.apply(res, [bodyJson, ...args] as any);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 140) logLine = logLine.slice(0, 139) + "…";
      log(logLine);
    }
  });

  next();
});

let bootPromise: Promise<void> | null = null;

/**
 * Bootstraps routes (and local dev static/vite), but DOES NOT always listen.
 * - On Vercel: registers routes only (no server.listen).
 * - Locally: registers routes + vite/static + server.listen.
 */
export function bootServerOnce() {
  if (bootPromise) return bootPromise;

  bootPromise = (async () => {
    const server = await registerRoutes(app);

    // Error handler (after routes)
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      // don’t throw here in serverless; just log
      log(`[express] error ${status}: ${message}`);
    });

    const isVercel = !!process.env.VERCEL;

    // On Vercel, do NOT bind/listen. Vercel will invoke the app as a handler.
    if (isVercel) {
      log("[express] booted for Vercel (no listen)");
      return;
    }

    // Local dev / non-Vercel runtime:
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const port = parseInt(process.env.PORT || "5000", 10);

    // Local dev bind
    server.listen(port, "127.0.0.1", () => {
      log(`[express] serving on port ${port}`);
    });
  })();

  return bootPromise;
}

// Export the app for Vercel to mount under /api/*
export default app;

// Kick off boot automatically (safe; runs once)
void bootServerOnce();