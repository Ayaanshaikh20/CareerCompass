import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000, // Frontend port
    proxy: {
      "/api": {
        target: "https://careercompass-bs0j.onrender.com", // Backend server URL
        changeOrigin: true,
      },
    },
    host: true,
  },
  plugins: [react()],
  build: {
    outDir: "build", // Specify the output directory
  },
});
