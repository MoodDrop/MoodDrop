// server/index.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// ✅ Use Replit or Vercel’s dynamic port OR default to 3000 locally
const PORT = Number(process.env.PORT) || 3000;

// Serve static files from Vite build output if it exists
app.use(express.static(path.join(__dirname, "../dist")));

// Optional health check route
app.get("/health", (_req, res) => {
  res.send("✅ MoodDrop server is running fine!");
});

// Example API endpoint (you can remove or expand later)
app.get("/api/message", (_req, res) => {
  res.json({ message: "Hello from MoodDrop backend!" });
});

// Catch-all: send index.html for all other routes (for React/Vite)
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// Start the server safely
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`[express] 🚀 MoodDrop server running on port ${PORT}`);
});

// Graceful shutdown (helps prevent “address already in use” errors)
process.on("SIGTERM", () => {
  console.log("🛑 Server shutting down...");
  server.close();
});

process.on("SIGINT", () => {
  console.log("🛑 Server manually stopped.");
  server.close();
});
