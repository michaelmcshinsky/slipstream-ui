export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { hashPassword, assertStrongPassword } from '@/lib/passwords';

import { createSession } from '@/lib/session';
import { hashToken } from '@/lib/tokens';
import { audit } from '@/lib/audit';
import { handle, readJson, badRequest } from '@/lib/http';

export async function POST(request: Request) {
  return handle(async () => {
    const body = await readJson<{ token?: string; password?: string }>(request);
    if (!body.token) badRequest('Reset token is required.');
    if (!body.password) badRequest('New password is required.');
    assertStrongPassword(body.password);

    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashToken(body.token) },
    });
    if (!record || record.usedAt || record.expiresAt < new Date()) {
      badRequest('This reset link is invalid or has expired.');
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash: hashPassword(body.password) },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      // Force re-auth everywhere after a credential change.
      prisma.session.deleteMany({ where: { userId: record.userId } }),
    ]);
    
    await createSession(record.userId);
    await audit({ actorId: record.userId, action: 'user.password.reset', targetType: 'user', targetId: record.userId });
    return { ok: true };
  });
}
