export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireUser } from '@/lib/session';
import { requireMembership } from '@/lib/teams';
import { downgradeToFree } from '@/lib/billing';
import { audit } from '@/lib/audit';
import { handle, readJson, badRequest } from '@/lib/api/handle';

export async function POST(request: Request) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());
    const body = await readJson<{ teamId?: string }>(request);
    if (!body.teamId) badRequest('teamId is required.');
    await requireMembership(user.id, body.teamId, 'OWNER');

    const subscription = await prisma.subscription.findUnique({ where: { teamId: body.teamId } });
    if (!subscription || subscription.plan === 'FREE') badRequest('No paid subscription to cancel.');

    // Mock provider cancels immediately; Stripe cancels at period end via portal.
    await downgradeToFree(body.teamId);
    await audit({ actorId: user.id, action: 'billing.canceled', targetType: 'team', targetId: body.teamId });
    return { ok: true };
  });
}
