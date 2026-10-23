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
    // Prisma + SQLite integration tests issue many sequential writes and run
    // alongside other suites when invoked through turbo, so the 5s default
    // times out under load.
    testTimeout: 30_000,
    hookTimeout: 30_000,
    env: {
      // connection_limit=1 serializes SQLite access: all test files share one
      // per-run database, and parallel workers otherwise trip lock timeouts
      // under full-machine load.
      DATABASE_URL: `file:${path.join(os.tmpdir(), `slipstream-test-${randomUUID()}.db`).replaceAll('\\', '/')}?connection_limit=1`,
      SESSION_SECRET: 'test-secret-at-least-32-characters!!',
    },
    globalSetup: [path.resolve(rootDir, 'src/test/global-setup.ts')],
  },
});
