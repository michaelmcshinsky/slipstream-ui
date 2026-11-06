import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: path.resolve(__dirname),
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
  cacheDir: path.join(path.resolve(__dirname), '.vitest-cache'),
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'app/**/*.test.ts', 'app/**/*.test.tsx'],
    setupFiles: ['./src/test/setup.ts'],
    testTimeout: 15000,
  },
});
