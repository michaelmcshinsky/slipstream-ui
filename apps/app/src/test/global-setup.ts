import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Creates a throwaway SQLite database for the test run.
 * DATABASE_URL=file:./test.db resolves relative to the Prisma schema dir
 * (packages/db/prisma), so the throwaway lives there too.
 */
export default function setup() {
  const dbRoot = path.resolve(process.cwd(), '../../packages/db');
  for (const name of ['test.db', 'test.db-journal']) {
    fs.rmSync(path.join(dbRoot, 'prisma', name), { force: true });
  }
  execSync('npx prisma db push --skip-generate', {
    cwd: dbRoot,
    env: { ...process.env, DATABASE_URL: 'file:./test.db' },
    stdio: 'ignore',
  });
}
