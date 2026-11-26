import { randomUUID } from 'node:crypto';
import { afterAll, describe, expect, it } from 'vitest';
import { prisma } from '@slipstream-ui/db';
import { purgeExpiredData, RETENTION_DAYS } from './retention';
import { generateToken, hashToken } from './tokens';

const DAY_MS = 24 * 60 * 60 * 1000;
const createdUserIds: string[] = [];

async function makeUser() {
  const user = await prisma.user.create({
    data: { email: `retention-${randomUUID()}@test.dev`, emailVerifiedAt: new Date() },
  });
  createdUserIds.push(user.id);
  return user;
}

afterAll(async () => {
  await prisma.session.deleteMany({ where: { userId: { in: createdUserIds } } });
  await prisma.emailVerificationToken.deleteMany({ where: { userId: { in: createdUserIds } } });
  await prisma.passwordResetToken.deleteMany({ where: { userId: { in: createdUserIds } } });
  await prisma.newsletterDelivery.deleteMany({ where: { userId: { in: createdUserIds } } });
  await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
});

describe('purgeExpiredData', () => {
  it('deletes expired sessions and stale auth tokens but keeps live rows', async () => {
    const user = await makeUser();
    const now = Date.now();

    await prisma.session.create({
      data: {
        tokenHash: hashToken(generateToken()),
        userId: user.id,
        expiresAt: new Date(now - DAY_MS),
        lastSeenAt: new Date(now - 2 * DAY_MS),
      },
    });
    await prisma.session.create({
      data: {
        tokenHash: hashToken(generateToken()),
        userId: user.id,
        expiresAt: new Date(now + 7 * DAY_MS),
        lastSeenAt: new Date(now),
      },
    });

    const expiredVerify = await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(generateToken()),
        expiresAt: new Date(now - DAY_MS),
      },
    });
    const usedReset = await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(generateToken()),
        expiresAt: new Date(now + DAY_MS),
        usedAt: new Date(now - (RETENTION_DAYS.authToken + 1) * DAY_MS),
      },
    });
    const freshReset = await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(generateToken()),
        expiresAt: new Date(now + DAY_MS),
      },
    });

    const result = await purgeExpiredData();

    expect(result.sessions).toBeGreaterThanOrEqual(1);
    expect(result.emailVerificationTokens).toBeGreaterThanOrEqual(1);
    expect(result.passwordResetTokens).toBeGreaterThanOrEqual(1);

    const remainingSessions = await prisma.session.count({ where: { userId: user.id } });
    expect(remainingSessions).toBe(1);
    expect(await prisma.emailVerificationToken.findUnique({ where: { id: expiredVerify.id } })).toBeNull();
    expect(await prisma.passwordResetToken.findUnique({ where: { id: usedReset.id } })).toBeNull();
    expect(await prisma.passwordResetToken.findUnique({ where: { id: freshReset.id } })).not.toBeNull();
  });

  it('is idempotent', async () => {
    const first = await purgeExpiredData();
    const second = await purgeExpiredData();
    expect(second.sessions).toBe(0);
    expect(second.emailVerificationTokens).toBe(0);
    expect(first).toBeDefined();
  });
});
