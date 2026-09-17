export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { createHash } from 'node:crypto';
import { prisma } from '@slipstream-ui/db';
import { SESSION_COOKIE } from '@/lib/session';
import { audit } from '@/lib/audit';
import { handle, badRequest } from '@/lib/api/handle';

/** Restore the admin session parked during impersonation. */
export async function POST(request: Request) {
  return handle(request, async () => {
    const store = await cookies();
    const adminToken = store.get('slipstream_impersonator')?.value;
    if (!adminToken) badRequest('Not currently impersonating.');

    const actor = await prisma.session.findUnique({
      where: { tokenHash: createHash('sha256').update(adminToken).digest('hex') },
      include: { user: true },
    });
    if (!actor || actor.expiresAt <= new Date() || actor.user.suspendedAt || actor.user.role !== 'ADMIN') {
      store.delete('slipstream_impersonator');
      badRequest('The administrator session is no longer valid.');
    }

    const currentToken = store.get(SESSION_COOKIE)?.value;
    if (currentToken && currentToken !== adminToken) {
      await prisma.session.deleteMany({
        where: { tokenHash: createHash('sha256').update(currentToken).digest('hex') },
      });
    }

    store.set(SESSION_COOKIE, adminToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: actor.expiresAt,
    });
    store.delete('slipstream_impersonator');

    await audit({ actorId: actor.userId, action: 'admin.impersonate.stop' });
    return { ok: true };
  });
}
