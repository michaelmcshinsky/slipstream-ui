import { prisma } from '@slipstream-ui/db';
import { getPlan } from './plans';
import { auditFailureCount } from './audit';

export type BusinessMetrics = {
  users: { total: number; new30d: number; suspended: number };
  billing: {
    mrr: number;
    arr: number;
    activePaidSubscriptions: number;
    pastDueSubscriptions: number;
    byPlan: Record<string, number>;
    revenue30dCents: number;
    revenue30dByCurrency: Record<string, number>;
    payments30d: number;
  };
  audit: { writeFailures: number };
};

/**
 * Single source of truth for admin business metrics. Used by the admin
 * metrics endpoint and by the nightly snapshot cron so stored snapshots are
 * computed identically to what admins see.
 */
export async function computeBusinessMetrics(): Promise<BusinessMetrics> {
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [totalUsers, newUsers30d, suspendedUsers, renewingSubscriptions, pastDueSubscriptions, payments, revenueByCurrency] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: since30d } } }),
    prisma.user.count({ where: { suspendedAt: { not: null } } }),
    // MRR counts subscriptions that will actually renew: active, paid plan,
    // and not already scheduled to cancel at period end.
    prisma.subscription.findMany({
      where: { status: 'ACTIVE', plan: { not: 'FREE' }, cancelAtPeriodEnd: false },
    }),
    prisma.subscription.count({ where: { status: 'PAST_DUE', plan: { not: 'FREE' } } }),
    prisma.payment.aggregate({
      where: { status: 'PAID', createdAt: { gte: since30d } },
      _sum: { amountCents: true },
      _count: true,
    }),
    // Revenue is grouped by currency: summing cents across currencies
    // would silently mix USD with any future currency.
    prisma.payment.groupBy({
      by: ['currency'],
      where: { status: 'PAID', createdAt: { gte: since30d } },
      _sum: { amountCents: true },
    }),
  ]);

  // MRR from plan catalog prices (single source of truth in lib/plans).
  const mrr = renewingSubscriptions.reduce((sum, sub) => sum + (getPlan(sub.plan)?.priceCents ?? 0), 0);

  const byPlan = renewingSubscriptions.reduce<Record<string, number>>((acc, sub) => {
    acc[sub.plan] = (acc[sub.plan] ?? 0) + 1;
    return acc;
  }, {});

  return {
    users: { total: totalUsers, new30d: newUsers30d, suspended: suspendedUsers },
    billing: {
      mrr,
      arr: mrr * 12,
      activePaidSubscriptions: renewingSubscriptions.length,
      pastDueSubscriptions,
      byPlan,
      revenue30dCents: payments._sum.amountCents ?? 0,
      revenue30dByCurrency: Object.fromEntries(
        revenueByCurrency.map((row) => [row.currency, row._sum.amountCents ?? 0]),
      ),
      payments30d: payments._count,
    },
    audit: { writeFailures: auditFailureCount() },
  };
}
