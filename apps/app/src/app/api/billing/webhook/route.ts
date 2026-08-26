export const dynamic = 'force-dynamic';

import { createHmac, timingSafeEqual } from 'node:crypto';
import { prisma } from '@slipstream-ui/db';
import { activateSubscription, downgradeToFree } from '@/lib/billing';
import { handle, badRequest } from '@/lib/http';

/** Verify Stripe's signature header (t=v1 scheme). No-op without a secret. */
function verifyStripeSignature(payload: string, header: string | null): boolean {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return true; // dev/test without configured webhooks
  if (!header) return false;
  const parts = Object.fromEntries(header.split(',').map((part) => part.split('=') as [string, string]));
  if (!parts.t || !parts.v1) return false;
  const expected = createHmac('sha256', secret).update(`${parts.t}.${payload}`).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  return handle(async () => {
    const payload = await request.text();
    if (!verifyStripeSignature(payload, request.headers.get('stripe-signature'))) {
      badRequest('Invalid webhook signature.');
    }
    const event = JSON.parse(payload) as { type: string; data: { object: Record<string, unknown> } };
    const object = event.data?.object ?? {};
    const teamId =
      (object.client_reference_id as string | undefined) ??
      ((object.metadata as Record<string, string> | undefined)?.teamId ?? '');

    switch (event.type) {
      case 'checkout.session.completed':
      case 'customer.subscription.updated': {
        if (!teamId) break;
        const items = (object.items as { data: { price: { nickname: string } }[] } | undefined)?.data;
        const plan = (items?.[0]?.price.nickname ?? 'PRO').toUpperCase();
        await activateSubscription(teamId, plan, {
          customerId: object.customer as string | undefined,
          subscriptionId: object.subscription as string | undefined,
        });
        break;
      }
      case 'invoice.paid':
      case 'invoice.payment_succeeded': {
        if (!teamId && !object.customer) break;
        const subscription = await prisma.subscription.findFirst({
          where: { OR: [{ customerId: object.customer as string }, { teamId }] },
        });
        if (subscription) {
          await prisma.payment.create({
            data: {
              teamId: subscription.teamId,
              subscriptionId: subscription.id,
              amountCents: Number(object.amount_paid ?? 0),
              description: `Invoice ${(object.number as string | undefined) ?? ''}`.trim(),
              status: 'PAID',
              externalId: (object.id as string) ?? `in_${Date.now()}`,
            },
          });
        }
        break;
      }
      case 'invoice.payment_failed': {
        if (teamId) {
          await prisma.subscription.updateMany({ where: { teamId }, data: { status: 'PAST_DUE' } });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        if (teamId) await downgradeToFree(teamId);
        break;
      }
      default:
        break;
    }
    return { received: true };
  });
}
