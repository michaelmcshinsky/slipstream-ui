export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireAdmin, createSession } from '@/lib/session';
import { audit } from '@/lib/audit';
import { handle, badRequest, z } from '@/lib/api/handle';
import { parseBody } from '@/lib/api/core';

type Params = { params: Promise<{ userId: string }> };

/**
 * Impersonation: the admin's own session token is parked in an
 * impersonator cookie so "stop impersonating" can restore it.
 * Every start and stop is written to the audit log.
 */
const IMPERSONATION_MAX_AGE_MS = 60 * 60 * 1000;

export async function POST(request: Request, { params }: Params) {
  return handle(request, async () => {
    const admin = requireAdmin(await getSessionUser());
    const { userId } = await params;
    if (userId === admin.id) badRequest('You are already signed in as this user.');

    // Governance: every impersonation needs a stated reason (ticket, user
    // request, incident) recorded in the audit log.
    const body = await parseBody(
      request,
      z.object({ reason: z.string().trim().min(3).max(500) }),
    );

    const store = await cookies();
    // Nested impersonation would overwrite the parked admin token and lose
    // the original session.
    if (store.get('slipstream_impersonator')) {
      badRequest('Stop the current impersonation before starting another.');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) badRequest('User not found.');
    if (user.suspendedAt) badRequest('Cannot impersonate a suspended user.');

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

    // Time-boxed: if the admin never clicks "stop", the session dies within
    // the hour instead of living for the normal session lifetime.
    await createSession(userId, { maxAgeMs: IMPERSONATION_MAX_AGE_MS });
    await audit({
      actorId: admin.id,
      action: 'admin.impersonate.start',
      targetType: 'user',
      targetId: userId,
      metadata: { reason: body.reason },
    });
    return { ok: true };
  });
}
