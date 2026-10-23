export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireAdmin } from '@/lib/session';
import { refundPayment } from '@/lib/billing';
import { audit } from '@/lib/audit';
import { handle, badRequest } from '@/lib/api/handle';

type Params = { params: Promise<{ paymentId: string }> };

/** Refund a payment. Mock mode flips local state; stripe mode issues a real refund and only marks refunded after the provider confirms (KC-007). */
export async function POST(request: Request, { params }: Params) {
  return handle(request, async () => {
    const admin = requireAdmin(await getSessionUser());
    const { paymentId } = await params;
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) badRequest('Payment not found.');
    if (payment.status === 'REFUNDED') badRequest('Payment already refunded.');

    // Throws when the provider refund fails; the payment stays unrefunded.
    await refundPayment(payment);

    const updated = await prisma.payment.findUniqueOrThrow({ where: { id: paymentId } });
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
