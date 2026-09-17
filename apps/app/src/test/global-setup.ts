import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import type { TestProject } from 'vitest/node';

export default function setup(project: TestProject) {
  const databaseUrl = project.config.env.DATABASE_URL;
  if (!databaseUrl?.startsWith('file:')) throw new Error('Missing isolated test database URL.');
  const databasePath = path.resolve(databaseUrl.slice(5));
  if (path.dirname(databasePath) !== path.resolve(os.tmpdir()) || !/^slipstream-test-[\da-f-]+\.db$/.test(path.basename(databasePath))) {
    throw new Error('Test database must be an isolated temporary file.');
  }
  const dbRoot = fileURLToPath(new URL('../../../../packages/db/', import.meta.url));
  const cleanup = () => {
    for (const suffix of ['', '-journal', '-wal', '-shm']) {
      fs.rmSync(databasePath + suffix, { force: true });
    }
  };
  try {
    execFileSync(process.execPath, [path.join(dbRoot, 'node_modules/prisma/build/index.js'), 'db', 'push', '--skip-generate'], {
      cwd: dbRoot,
      env: { ...process.env, DATABASE_URL: databaseUrl },
      stdio: 'pipe',
    });
  } catch (error) {
    cleanup();
    throw error;
  }
  return cleanup;
}
