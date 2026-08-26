export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireAdmin, createSession } from '@/lib/session';
import { audit } from '@/lib/audit';
import { handle, badRequest } from '@/lib/http';

type Params = { params: Promise<{ userId: string }> };

/**
 * Impersonation: the admin's own session token is parked in an
 * impersonator cookie so "stop impersonating" can restore it.
 * Every start and stop is written to the audit log.
 */
export async function POST(_request: Request, { params }: Params) {
  return handle(async () => {
    const admin = requireAdmin(await getSessionUser());
    const { userId } = await params;
    if (userId === admin.id) badRequest('You are already signed in as this user.');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) badRequest('User not found.');

    const store = await cookies();
    const adminToken = store.get('slipstream_session')?.value;
    if (adminToken) {
      store.set('slipstream_impersonator', adminToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60,
      });
    }

    await createSession(userId);
    await audit({
      actorId: admin.id,
      action: 'admin.impersonate.start',
      targetType: 'user',
      targetId: userId,
    });
    return { ok: true };
  });
}
