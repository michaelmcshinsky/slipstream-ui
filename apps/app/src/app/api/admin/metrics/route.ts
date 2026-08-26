export const dynamic = 'force-dynamic';

import { prisma } from '@slipstream-ui/db';
import { getSessionUser, requireAdmin } from '@/lib/session';
import { handle } from '@/lib/http';

/** Business metrics for the super-admin overview. */
export async function GET() {
  return handle(async () => {
    requireAdmin(await getSessionUser());

    const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [totalUsers, newUsers30d, suspendedUsers, paidSubscriptions, payments] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: since30d } } }),
      prisma.user.count({ where: { suspendedAt: { not: null } } }),
      prisma.subscription.findMany({ where: { status: 'ACTIVE', plan: { not: 'FREE' } } }),
      prisma.payment.aggregate({
        where: { status: 'PAID', createdAt: { gte: since30d } },
        _sum: { amountCents: true },
        _count: true,
      }),
    ]);

    // MRR from active plan prices.
    const planPrices: Record<string, number> = { PRO: 2900, TEAM: 9900, ENTERPRISE: 49900 };
    const mrr = paidSubscriptions.reduce((sum, sub) => sum + (planPrices[sub.plan] ?? 0), 0);

    const byPlan = paidSubscriptions.reduce<Record<string, number>>((acc, sub) => {
      acc[sub.plan] = (acc[sub.plan] ?? 0) + 1;
      return acc;
    }, {});

    return {
      users: { total: totalUsers, new30d: newUsers30d, suspended: suspendedUsers },
      billing: {
        mrr,
        arr: mrr * 12,
        activePaidSubscriptions: paidSubscriptions.length,
        byPlan,
        revenue30dCents: payments._sum.amountCents ?? 0,
        payments30d: payments._count,
      },
    };
  });
}
