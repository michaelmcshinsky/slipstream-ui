import path from 'node:path';
import os from 'node:os';
import { randomUUID } from 'node:crypto';
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
    env: {
      DATABASE_URL: `file:${path.join(os.tmpdir(), `slipstream-test-${randomUUID()}.db`).replaceAll('\\', '/')}`,
      SESSION_SECRET: 'test-secret-at-least-32-characters!!',
    },
    globalSetup: [path.resolve(rootDir, 'src/test/global-setup.ts')],
  },
});
