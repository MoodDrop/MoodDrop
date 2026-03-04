import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertMessageSchema,
  updateMessageSchema,
  insertFeaturedVideoSchema,
  updateFeaturedVideoSchema,
} from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { registerHarmonyRoutes } from "./harmony";

/* ---------------------------------- */
/* Multer Setup */
/* ---------------------------------- */

const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads", "audio");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `voice-${uniqueSuffix}.webm`);
  },
});

const upload = multer({
  storage: audioStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed"));
    }
  },
});

/* ---------------------------------- */
/* Register Routes */
/* ---------------------------------- */

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  // ✅ Register Harmony API
  registerHarmonyRoutes(app);

  /* ----------------------------- */
  /* Admin Guard */
  /* ----------------------------- */

  function requireAdmin(req: any, res: any, next: any) {
    const expected = process.env.ADMIN_KEY;

    if (!expected) {
      return res.status(500).json({ message: "ADMIN_KEY not set" });
    }

    const token =
      req.header("x-admin-key") ||
      (req.header("authorization")?.replace("Bearer ", "") ?? "");

    if (!token || token !== expected) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return next();
  }

  /* ----------------------------- */
  /* Auth Routes */
  /* ----------------------------- */

  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  /* ----------------------------- */
  /* Messages */
  /* ----------------------------- */

  app.post("/api/messages", upload.single("audio"), async (req: any, res) => {
    try {
      const userId = req.isAuthenticated?.() ? req.user?.claims?.sub : null;

      let messageData;

      if (req.file) {
        messageData = {
          userId,
          emotion: req.body.emotion,
          type: "voice",
          audioFilename: req.file.filename,
          duration: req.body.duration,
          content: null,
        };
      } else {
        messageData = {
          userId,
          emotion: req.body.emotion,
          type: "text",
          content: req.body.content,
          audioFilename: null,
          duration: null,
        };
      }

      const validatedData = insertMessageSchema.parse(messageData);
      const message = await storage.createMessage(validatedData);

      if (userId) {
        await storage.updateUserStreak(userId);
      }

      res.json({ success: true, message });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  /* ---------------------------------- */
  /* Return HTTP Server */
/* ---------------------------------- */

  const httpServer = createServer(app);
  return httpServer;
}