import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const clientEnv = loadEnv(mode, path.resolve(__dirname, "client"), "");
  const mergedEnv = { ...env, ...clientEnv };

  return {
    root: "client",
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client/src"),
        "@assets": path.resolve(__dirname, "client/src/assets"),
      },
    },
    define: { "process.env": mergedEnv },
  };
});
