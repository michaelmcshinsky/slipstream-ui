export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireAdmin } from '@/lib/session';
import { audit } from '@/lib/audit';
import { handle, badRequest } from '@/lib/http';

type Params = { params: Promise<{ paymentId: string }> };

/** Mark a payment refunded (mock). Stripe mode issues a real refund via API. */
export async function POST(_request: Request, { params }: Params) {
  return handle(async () => {
    const admin = requireAdmin(await getSessionUser());
    const { paymentId } = await params;
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) badRequest('Payment not found.');
    if (payment.status === 'REFUNDED') badRequest('Payment already refunded.');

    // Stripe branch (real refund):
    // if (payment.externalId?.startsWith('in_')) { stripe.refunds.create({ invoice: payment.externalId }); }

    const updated = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'REFUNDED' },
    });
    await audit({
      actorId: admin.id,
      action: 'admin.payment.refund',
      targetType: 'payment',
      targetId: paymentId,
      metadata: { amountCents: updated.amountCents },
    });
    return { payment: updated };
  });
}
