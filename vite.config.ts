
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: '/', 
  server: {
    port: 3001,
    host: '0.0.0.0', // Allow access from external IP
    strictPort: true,
  },
  preview: {
    port: 3001,
    host: '0.0.0.0', // Allow access from external IP on VPS
    allowedHosts: ['all'], // Allow all hosts/domains
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemap in production to save memory/bandwidth
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Advanced Chunk Splitting for better caching and loading on VPS
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            return 'vendor-utils';
          }
        }
      }
    }
  }
});
