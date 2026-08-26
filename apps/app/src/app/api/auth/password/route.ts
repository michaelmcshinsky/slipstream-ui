export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireUser, SESSION_COOKIE } from '@/lib/session';
import { hashPassword, verifyPassword, assertStrongPassword } from '@/lib/passwords';
import { hashToken } from '@/lib/tokens';
import { audit } from '@/lib/audit';
import { handle, readJson, badRequest } from '@/lib/http';

interface Body {
  currentPassword?: string;
  newPassword?: string;
  signOutOthers?: boolean;
}

export async function POST(request: Request) {
  return handle(async () => {
    const sessionUser = requireUser(await getSessionUser());
    const body = await readJson<Body>(request);
    if (!body.currentPassword || !body.newPassword) badRequest('Both passwords are required.');
    assertStrongPassword(body.newPassword);

    const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
    if (!user?.passwordHash || !verifyPassword(body.currentPassword, user.passwordHash)) {
      badRequest('Current password is incorrect.');
    }

    await prisma.user.update({
      where: { id: sessionUser.id },
      data: { passwordHash: hashPassword(body.newPassword) },
    });

    if (body.signOutOthers) {
      // Keep the caller's own session; revoke every other one.
      const store = await cookies();
      const currentHash = hashToken(store.get(SESSION_COOKIE)?.value ?? '');
      const sessions = await prisma.session.findMany({
        where: { userId: sessionUser.id, tokenHash: { not: currentHash } },
        select: { id: true },
      });
      for (const session of sessions) {
        await prisma.session.delete({ where: { id: session.id } });
      }
    }

    await audit({
      actorId: sessionUser.id,
      action: 'user.password.changed',
      targetType: 'user',
      targetId: sessionUser.id,
    });
    return { ok: true };
  });
}
