import { prisma } from '@slipstream-ui/db';
import { Stat } from '@/components/ui';

const PLAN_PRICES: Record<string, number> = { PRO: 2900, TEAM: 9900, ENTERPRISE: 49900 };

export default async function AdminOverviewPage() {
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalUsers, newUsers30d, suspendedUsers, paidSubs, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: since30d } } }),
    prisma.user.count({ where: { suspendedAt: { not: null } } }),
    prisma.subscription.findMany({ where: { status: 'ACTIVE', plan: { not: 'FREE' } } }),
    prisma.payment.aggregate({
      where: { status: 'PAID', createdAt: { gte: since30d } },
      _sum: { amountCents: true },
    }),
  ]);

  const mrr = paidSubs.reduce((sum, sub) => sum + (PLAN_PRICES[sub.plan] ?? 0), 0);
  const byPlan = paidSubs.reduce<Record<string, number>>((acc, sub) => {
    acc[sub.plan] = (acc[sub.plan] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Overview</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total users" value={totalUsers} />
        <Stat label="New users (30d)" value={newUsers30d} />
        <Stat label="MRR" value={`$${(mrr / 100).toLocaleString()}`} />
        <Stat label="Revenue 30d" value={`$${((revenue._sum.amountCents ?? 0) / 100).toLocaleString()}`} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Active paid subscriptions" value={paidSubs.length} />
        <Stat label="Suspended users" value={suspendedUsers} />
        <Stat
          label="Plan mix"
          value={Object.entries(byPlan).map(([plan, count]) => `${plan}: ${count}`).join(' · ') || '—'}
        />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Recent activity</h2>
        <ol className="space-y-1 text-sm text-muted-foreground">
          {(await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { actor: { select: { email: true } } } })).map(
            (log) => (
              <li key={log.id} className="flex justify-between border-b border-border/50 pb-1">
                <span>
                  <code className="mr-2 rounded bg-muted px-1 text-xs">{log.action}</code>
                  {log.actor?.email ?? 'system'}
                </span>
                <time dateTime={log.createdAt.toISOString()}>{log.createdAt.toLocaleString()}</time>
              </li>
            )
          )}
          {(await prisma.auditLog.count()) === 0 && <li>No activity yet.</li>}
        </ol>
      </section>
    </div>
  );
}
