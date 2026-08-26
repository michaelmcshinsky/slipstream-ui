export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { createHash } from 'node:crypto';
import { prisma } from '@slipstream-ui/db';
import { SESSION_COOKIE } from '@/lib/session';
import { audit } from '@/lib/audit';
import { handle, badRequest } from '@/lib/http';

/** Restore the admin session parked during impersonation. */
export async function POST() {
  return handle(async () => {
    const store = await cookies();
    const adminToken = store.get('slipstream_impersonator')?.value;
    if (!adminToken) badRequest('Not currently impersonating.');

    store.set(SESSION_COOKIE, adminToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    store.delete('slipstream_impersonator');

    const actor = await prisma.session.findUnique({
      where: { tokenHash: createHash('sha256').update(adminToken).digest('hex') },
    });
    if (actor) {
      await audit({ actorId: actor.userId, action: 'admin.impersonate.stop' });
    }
    return { ok: true };
  });
}
