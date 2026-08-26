export const dynamic = 'force-dynamic';

import { getSessionUser, requireUser } from '@/lib/session';
import { getBillingProvider } from '@/lib/billing';
import { requireMembership } from '@/lib/teams';
import { handle, readJson, badRequest } from '@/lib/api/handle';

export async function POST(request: Request) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());
    const body = await readJson<{ teamId?: string; plan?: string; email?: string }>(request);
    if (!body.teamId) badRequest('teamId is required.');
    if (!['PRO', 'TEAM', 'ENTERPRISE'].includes(body.plan ?? '')) badRequest('Invalid plan.');
    // Only team admins can buy.
    await requireMembership(user.id, body.teamId!, 'ADMIN');

    const provider = getBillingProvider();
    const checkout = await provider.createCheckout({
      teamId: body.teamId!,
      plan: body.plan!,
      email: body.email ?? user.email,
    });
    return checkout;
  });
}
