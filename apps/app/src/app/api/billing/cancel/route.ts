export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireUser } from '@/lib/session';
import { requireMembership } from '@/lib/teams';
import { cancelSubscription } from '@/lib/billing';
import { audit } from '@/lib/audit';
import { handle, badRequest, z } from '@/lib/api/handle';
import { parseBody } from '@/lib/api/core';

export async function POST(request: Request) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());
    const body = await parseBody(request, z.object({ teamId: z.string().min(1).optional() }));
    if (!body.teamId) badRequest('teamId is required.');
    await requireMembership(user.id, body.teamId, 'OWNER');

    const subscription = await prisma.subscription.findUnique({ where: { teamId: body.teamId } });
    if (!subscription || subscription.plan === 'FREE') badRequest('No paid subscription to cancel.');

    // Provider-aware: mock cancels immediately; Stripe schedules cancellation
    // at period end via the API and only then records it locally (KC-007).
    // Throws when the provider call fails, so success is never reported
    // without a confirmed cancellation.
    await cancelSubscription(body.teamId, user.id);
    await audit({ actorId: user.id, action: 'billing.canceled', targetType: 'team', targetId: body.teamId });
    return { ok: true };
  });
}
