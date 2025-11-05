// ~/workspace/mooddrop/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  root: 'client',                         // our app lives in client/
  plugins: [react(), tsconfigPaths()],    // resolve "@/..." from tsconfig paths
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
    },
  },
  server: { host: true, port: 5175, strictPort: false },
  preview:{ host: true, port: 5175 },
})
