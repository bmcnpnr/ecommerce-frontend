import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Pin the API base URL for tests instead of inheriting it from .env, which is
    // gitignored and so absent on a CI checkout. Without this the constant falls
    // back to the absolute http://localhost:8080, the relative MSW handlers stop
    // matching, and the suite passes locally while failing in CI.
    env: {
      VITE_API_BASE_URL: '/',
    },
  },
});
