import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600, // Optional: raises warning threshold (use sparingly)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const dirs = id.split('node_modules/')[1].split('/');
            if (dirs[0].startsWith('@')) {
              return `${dirs[0]}/${dirs[1]}`;
            }
            return dirs[0];
          }
        }
      }
    }
  }
});
