import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve('src'),
      '@/components': path.resolve('src/components'),
      '@/pages': path.resolve('src/pages'),
      '@/services': path.resolve('src/services'),
      '@/hooks': path.resolve('src/hooks'),
      '@/context': path.resolve('src/context'),
      '@/types': path.resolve('src/types'),
      '@/styles': path.resolve('src/styles'),
      '@/utils': path.resolve('src/utils'),
    },
  },
});