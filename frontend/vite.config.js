import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: mode === 'development' ? {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://careercompass-bs0j.onrender.com',
        changeOrigin: true,
      }
    },
    host: true
  } : undefined,
  build: {
    outDir: "build",
  }
}))
