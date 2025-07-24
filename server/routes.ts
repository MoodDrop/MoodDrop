import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

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
  
  // Submit a new message (text or voice)
  app.post("/api/messages", upload.single('audio'), async (req, res) => {
    try {
      let messageData;
      
      if (req.file) {
        // Voice message
        messageData = {
          emotion: req.body.emotion,
          type: 'voice',
          audioFilename: req.file.filename,
          duration: req.body.duration,
          content: null,
        };
      } else {
        // Text message
        messageData = {
          emotion: req.body.emotion,
          type: 'text',
          content: req.body.content,
          audioFilename: null,
          duration: null,
        };
      }

      const validatedData = insertMessageSchema.parse(messageData);
      const message = await storage.createMessage(validatedData);
      
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

  // Get all messages (admin only)
  app.get("/api/admin/messages", async (req, res) => {
    try {
      const messages = await storage.getAllMessages();
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
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
