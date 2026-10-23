import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import type { TestProject } from 'vitest/node';

const SETUP_ATTEMPTS = 3;
const SETUP_TIMEOUT_MS = 60_000;

function pushSchema(prismaCli: string, dbRoot: string, databaseUrl: string): void {
  execFileSync(
    process.execPath,
    [prismaCli, 'db', 'push', '--skip-generate'],
    {
      cwd: dbRoot,
      env: { ...process.env, DATABASE_URL: databaseUrl },
      stdio: 'pipe',
      timeout: SETUP_TIMEOUT_MS,
    },
  );
}

export default function setup(project: TestProject) {
  const databaseUrl = project.config.env.DATABASE_URL;
  if (!databaseUrl?.startsWith('file:')) throw new Error('Missing isolated test database URL.');
  // Strip Prisma URL params (e.g. ?connection_limit=1) before path checks.
  const databasePath = path.resolve(databaseUrl.slice(5).split('?')[0] ?? '');
  if (path.dirname(databasePath) !== path.resolve(os.tmpdir()) || !/^slipstream-test-[\da-f-]+\.db$/.test(path.basename(databasePath))) {
    throw new Error('Test database must be an isolated temporary file.');
  }
  const dbRoot = fileURLToPath(new URL('../../../../packages/db/', import.meta.url));
  const prismaCli = path.join(dbRoot, 'node_modules/prisma/build/index.js');
  const cleanup = () => {
    for (const suffix of ['', '-journal', '-wal', '-shm']) {
      fs.rmSync(databasePath + suffix, { force: true });
    }
  };
  let lastError: unknown;
  for (let attempt = 1; attempt <= SETUP_ATTEMPTS; attempt++) {
    try {
      // Drop any partial database left by a previous failed attempt before retrying.
      cleanup();
      pushSchema(prismaCli, dbRoot, databaseUrl);
      return cleanup;
    } catch (error) {
      lastError = error;
      // The schema engine occasionally fails transiently on Windows (file
      // locks, antivirus scanning the freshly created database); retry before
      // giving up.
      if (attempt < SETUP_ATTEMPTS) continue;
    }
  }
  cleanup();
  const detail =
    lastError && typeof lastError === 'object' && 'stderr' in lastError
      ? `\n${String((lastError as { stderr: Buffer }).stderr ?? '').trim()}`
      : '';
  throw new Error(
    `Failed to initialize the isolated test database after ${SETUP_ATTEMPTS} attempts: ${databasePath}${detail}`,
    { cause: lastError },
  );
}
