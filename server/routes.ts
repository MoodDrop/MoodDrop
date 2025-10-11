import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, updateMessageSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { setupAuth, isAuthenticated } from "./replitAuth";

// Configure multer for audio file uploads
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'audio');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `voice-${uniqueSuffix}.webm`);
  }
});

const upload = multer({ 
  storage: audioStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get user's messages for mood garden
  app.get('/api/garden/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messages = await storage.getUserMessages(userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching garden messages:", error);
      res.status(500).json({ message: "Failed to fetch garden messages" });
    }
  });
  
  // Submit a new message (text or voice)
  app.post("/api/messages", upload.single('audio'), async (req: any, res) => {
    try {
      // Get userId if user is authenticated (optional for anonymous messages)
      const userId = req.isAuthenticated?.() ? req.user?.claims?.sub : null;
      
      let messageData;
      
      if (req.file) {
        // Voice message
        messageData = {
          userId,
          emotion: req.body.emotion,
          type: 'voice',
          audioFilename: req.file.filename,
          duration: req.body.duration,
          content: null,
        };
      } else {
        // Text message
        messageData = {
          userId,
          emotion: req.body.emotion,
          type: 'text',
          content: req.body.content,
          audioFilename: null,
          duration: null,
        };
      }

      const validatedData = insertMessageSchema.parse(messageData);
      const message = await storage.createMessage(validatedData);
      
      // Update user streak if authenticated
      if (userId) {
        await storage.updateUserStreak(userId);
      }
      
      res.json({ success: true, message });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await storage.getAdminByUsername(username);
      
      if (!admin || admin.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, you'd set up proper session management here
      res.json({ success: true, admin: { id: admin.id, username: admin.username } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get all messages with filters (admin only)
  app.get("/api/admin/messages", async (req, res) => {
    try {
      const { status, emotion, search } = req.query;
      const filters = {
        status: status as string,
        emotion: emotion as string,
        search: search as string,
      };
      const messages = await storage.getAllMessages(filters);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get message statistics (admin only)
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getMessageStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update message status (admin only)
  app.patch("/api/admin/messages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateMessageSchema.parse(req.body);
      const message = await storage.updateMessage(id, validatedData);
      
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.json({ success: true, message });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Bulk delete messages (admin only)
  app.delete("/api/admin/messages/bulk", async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) {
        return res.status(400).json({ message: "IDs must be an array" });
      }
      
      const deletedCount = await storage.bulkDeleteMessages(ids);
      res.json({ success: true, deletedCount });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Bulk update messages (admin only)
  app.patch("/api/admin/messages/bulk", async (req, res) => {
    try {
      const { ids, updates } = req.body;
      if (!Array.isArray(ids)) {
        return res.status(400).json({ message: "IDs must be an array" });
      }
      
      const validatedUpdates = updateMessageSchema.parse(updates);
      const updatedCount = await storage.bulkUpdateMessages(ids, validatedUpdates);
      res.json({ success: true, updatedCount });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete a message (admin only)
  app.delete("/api/admin/messages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteMessage(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Serve audio files
  app.get("/api/audio/:filename", (req, res) => {
    const { filename } = req.params;
    const audioPath = path.join(process.cwd(), 'uploads', 'audio', filename);
    
    if (!fs.existsSync(audioPath)) {
      return res.status(404).json({ message: "Audio file not found" });
    }
    
    res.sendFile(audioPath);
  });

  const httpServer = createServer(app);
  return httpServer;
}
