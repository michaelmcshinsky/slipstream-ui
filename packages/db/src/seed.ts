/**
 * Idempotent database seed (KC-041).
 *
 * Bootstraps a platform admin from ADMIN_EMAIL / ADMIN_PASSWORD. There are no
 * default credentials: with the variables unset the seed prints setup guidance
 * and exits successfully without touching the database. Running it repeatedly
 * is safe — an existing admin is left as-is unless the password env changed
 * (then the credential is rotated).
 */
import { randomBytes, scryptSync } from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Mirrors apps/app/src/lib/passwords.ts: scrypt, format salt:hash (hex). */
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function main(): Promise<void> {
  // Existing-account migration (KC-040): accounts created before email
  // verification shipped cannot retroactively confirm, so they are
  // grandfathered by stamping emailVerifiedAt with their creation time.
  // Idempotent — only touches rows where emailVerifiedAt is still null.
  const unverified = await prisma.user.findMany({
    where: { emailVerifiedAt: null },
    select: { id: true, createdAt: true },
  });
  for (const user of unverified) {
    await prisma.user.update({ where: { id: user.id }, data: { emailVerifiedAt: user.createdAt } });
  }
  if (unverified.length > 0) {
    console.log(`[seed] Grandfathered ${unverified.length} pre-feature account(s) as email-verified (KC-040 migration).`);
  }

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log('[seed] ADMIN_EMAIL/ADMIN_PASSWORD not set — skipping admin bootstrap (no default credentials).');
    console.log('[seed] Create a platform admin with:');
    console.log('[seed]   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=<strong-password> pnpm --filter @slipstream-ui/db db:seed');
    return;
  }
  if (!email.includes('@')) throw new Error('ADMIN_EMAIL must be a valid email address.');
  if (password.length < 12) throw new Error('ADMIN_PASSWORD must be at least 12 characters.');

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const user = await prisma.user.create({
      data: { email, role: 'ADMIN', passwordHash: hashPassword(password) },
    });
    console.log(`[seed] Created platform admin ${user.email}.`);
    return;
  }
  if (existing.role !== 'ADMIN') {
    await prisma.user.update({ where: { id: existing.id }, data: { role: 'ADMIN' } });
    console.log(`[seed] Promoted ${existing.email} to ADMIN.`);
  } else {
    console.log(`[seed] ${existing.email} is already an ADMIN.`);
  }
  // Rotate the stored credential when the provided password no longer matches.
  const [salt, storedHash] = existing.passwordHash?.split(':') ?? [];
  const unchanged =
    salt && storedHash &&
    scryptSync(password, salt, 64).toString('hex') === storedHash;
  if (!unchanged) {
    await prisma.user.update({ where: { id: existing.id }, data: { passwordHash: hashPassword(password) } });
    console.log(`[seed] Rotated the stored credential for ${existing.email}.`);
  }
}

main()
  .catch((error: unknown) => {
    console.error('[seed] failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
