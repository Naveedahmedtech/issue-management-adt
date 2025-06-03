import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // this block makes Vite listen on all network interfaces (0.0.0.0)
  server: {
    host: true, // or explicitly: host: '0.0.0.0'
    // strictPort: true,  // optional: fail if port is already in use
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Splitting node_modules into a separate chunk named "vendor"
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase the chunk size limit to 1000 KB
  },
});
