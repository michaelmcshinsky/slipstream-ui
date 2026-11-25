import path from 'node:path';
import os from 'node:os';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // The app tsconfig extends the Next preset (`jsx: preserve`), so tests need
  // the React plugin to transform JSX for vitest.
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(rootDir, 'src') },
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  cacheDir: path.join(rootDir, '.vitest-cache'),
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    // Prisma + SQLite integration tests issue many sequential writes and run
    // alongside other suites when invoked through turbo, so the 5s default
    // times out under load.
    testTimeout: 30_000,
    hookTimeout: 30_000,
    // Auth/billing flow tests share one SQLite database for the whole run.
    // Running files in parallel makes those writes interleave, so keep the
    // integration suite deterministic even when turbo starts other packages.
    fileParallelism: false,
    env: {
      // connection_limit=1 serializes SQLite access: all test files share one
      // per-run database, and parallel workers otherwise trip lock timeouts
      // under full-machine load.
      DATABASE_URL: `file:${path.join(os.tmpdir(), `slipstream-test-${randomUUID()}.db`).replaceAll('\\', '/')}?connection_limit=1`,
      SESSION_SECRET: 'test-secret-at-least-32-characters!!',
      // Tests use fixture passwords that exist in breach corpora; the HIBP
      // check has its own unit tests with an injected fetch.
      PASSWORD_BREACH_CHECK: 'off',
    },
    globalSetup: [path.resolve(rootDir, 'src/test/global-setup.ts')],
  },
});
