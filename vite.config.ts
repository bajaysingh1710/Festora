import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          genai: ['@google/genai'],
          ui: ['lucide-react', 'canvas-confetti', 'qrcode'],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});
