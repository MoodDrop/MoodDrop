// ~/workspace/mooddrop/vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: "client", // Your app lives in /client
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@assets": path.resolve(__dirname, "client/public/assets"),
    },
  },
  server: {
    host: true,
    port: 5176,
    strictPort: false,
  },
  preview: {
    host: true,
    port: 5176,
  },
});
