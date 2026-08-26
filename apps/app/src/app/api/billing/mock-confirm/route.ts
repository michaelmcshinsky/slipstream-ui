export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { activateSubscription } from '@/lib/billing';
import { issueLicense } from '@/lib/licenses';
import { handle, badRequest } from '@/lib/api/handle';

/**
 * Mock-provider "checkout completion". Mirrors what the Stripe webhook does:
 * activates the subscription, records the payment, and issues the license.
 * Disabled when BILLING_PROVIDER=stripe.
 */
export async function GET(request: Request) {
  return handle(request, async () => {
    if (process.env.BILLING_PROVIDER === 'stripe') {
      badRequest('Mock checkout is disabled in stripe mode.');
    }
    const url = new URL(request.url);
    const teamId = url.searchParams.get('teamId');
    const plan = url.searchParams.get('plan') ?? 'PRO';
    if (!teamId) badRequest('teamId is required.');

    await activateSubscription(teamId, plan);
    const amount = plan === 'TEAM' ? 9900 : plan === 'ENTERPRISE' ? 49900 : 2900;
    const externalId = `mock_${Date.now()}`;
    await prisma.payment.create({
      data: { teamId, amountCents: amount, description: `${plan} monthly`, status: 'PAID', externalId },
    });

    // Issue (or reuse) the team license owned by the team owner.
    const ownerMembership = await prisma.membership.findFirst({
      where: { teamId, role: 'OWNER' },
      orderBy: { createdAt: 'asc' },
    });
    if (ownerMembership) {
      const existing = await prisma.licenseKey.findFirst({
        where: { teamId, plan, status: 'ACTIVE' },
      });
      if (!existing) {
        await issueLicense({
          ownerId: ownerMembership.userId,
          teamId,
          plan,
          actorId: ownerMembership.userId,
          note: `Auto-issued with ${plan} subscription`,
        });
      }
    }

    return Response.redirect(new URL(`/dashboard/billing?checkout=success&teamId=${teamId}`, url.origin), 302);
  });
}
