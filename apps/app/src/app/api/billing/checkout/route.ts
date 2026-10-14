export const dynamic = 'force-dynamic';

import { getSessionUser, requireUser } from '@/lib/session';
import { getBillingProvider } from '@/lib/billing';
import { requireMembership } from '@/lib/teams';
import { handle } from '@/lib/api/handle';
import { parseBody } from '@/lib/api/core';
import { z } from 'zod';

const checkoutSchema = z.object({
  teamId: z.string().min(1),
  plan: z.enum(['PRO', 'TEAM', 'ENTERPRISE']),
  email: z.string().email().optional(),
});

export async function POST(request: Request) {
  return handle(request, async () => {
    const user = requireUser(await getSessionUser());
    const body = await parseBody(request, checkoutSchema);
    await requireMembership(user.id, body.teamId, 'ADMIN');

    return getBillingProvider().createCheckout({
      userId: user.id,
      teamId: body.teamId,
      plan: body.plan,
      email: body.email ?? user.email,
    });
  });
}
