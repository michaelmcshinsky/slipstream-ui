import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(rootDir, 'src') },
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // Each test run gets a throwaway SQLite file.
    env: { DATABASE_URL: 'file:./test.db', SESSION_SECRET: 'test-secret-at-least-32-characters!!' },
    globalSetup: [path.resolve(rootDir, 'src/test/global-setup.ts')],
  },
});
