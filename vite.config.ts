import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // Local Node backend (see server/server.js). Avoids CORS in dev.
      // Frontend calls /api/queue -> forwarded to http://localhost:3001/api/queue
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
