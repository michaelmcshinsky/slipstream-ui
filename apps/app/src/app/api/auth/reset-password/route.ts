export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { hashPassword, assertStrongPassword } from '@/lib/passwords';

import { createSession } from '@/lib/session';
import { hashToken } from '@/lib/tokens';
import { audit } from '@/lib/audit';
import { handle, badRequest, z } from '@/lib/api/handle';
import { parseBody } from '@/lib/api/core';

export async function POST(request: Request) {
  return handle(request, async () => {
    const body = await parseBody(request, z.object({ token: z.string().optional(), password: z.string().optional() }));
    const { token, password } = body;
    if (!token) badRequest('Reset token is required.');
    if (!password) badRequest('New password is required.');
    assertStrongPassword(password);

    const tokenHash = hashToken(token);
    const userId = await prisma.$transaction(async (tx) => {
      // Conditional claim: exactly one concurrent request can consume the
      // token; everyone else sees count 0 (KC-014).
      const claim = await tx.passwordResetToken.updateMany({
        where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
        data: { usedAt: new Date() },
      });
      if (claim.count !== 1) return null;
      const record = await tx.passwordResetToken.findUniqueOrThrow({ where: { tokenHash } });
      await tx.user.update({
        where: { id: record.userId },
        data: { passwordHash: hashPassword(password) },
      });
      // Force re-auth everywhere after a credential change.
      await tx.session.deleteMany({ where: { userId: record.userId } });
      return record.userId;
    });
    if (!userId) badRequest('This reset link is invalid or has expired.');

    await createSession(userId);
    await audit({ actorId: userId, action: 'user.password.reset', targetType: 'user', targetId: userId });
    return { ok: true };
  });
}
