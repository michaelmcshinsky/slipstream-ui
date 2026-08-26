import { prisma } from '@slipstream-ui/db';
import { getSessionUser } from '@/lib/session';
import { Stat } from '@/components/ui';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = (await getSessionUser())!;
  const memberships = await prisma.membership.findMany({
    where: { userId: user.id },
    include: { team: { include: { subscription: true, licenseKeys: true } } },
  });

  const activeLicenseCount = memberships.reduce(
    (sum, m) => sum + m.team.licenseKeys.filter((license) => license.status === 'ACTIVE').length,
    0
  );
  const paidTeam = memberships.find((m) => m.team.subscription && m.team.subscription.plan !== 'FREE');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back{user.name ? `, ${user.name}` : ''}</h1>
        <p className="mt-1 text-muted-foreground">Manage your Slipstream UI license, team, and billing.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Teams" value={memberships.length} />
        <Stat label="Active licenses" value={activeLicenseCount} />
        <Stat label="Current plan" value={paidTeam?.team.subscription?.plan ?? 'Free'} />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Your teams</h2>
        <div className="space-y-3">
          {memberships.map((membership) => (
            <div key={membership.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
              <div>
                <div className="font-medium">{membership.team.name}</div>
                <div className="text-sm text-muted-foreground">
                  Role: {membership.role} · Plan: {membership.team.subscription?.plan ?? 'Free'}
                </div>
              </div>
              <Link
                href={`/dashboard/billing?teamId=${membership.team.id}`}
                className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
              >
                Manage billing
              </Link>
            </div>
          ))}
          {memberships.length === 0 && (
            <p className="text-sm text-muted-foreground">No teams yet.</p>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-muted/30 p-6">
        <h2 className="font-semibold">Use your license with the CLI</h2>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 text-xs"><code>{`npx slipstream-ui login --key slip_pro_xxxx`}</code></pre>
        <p className="mt-2 text-xs text-muted-foreground">
          The CLI validates against <code>/api/licenses/validate</code> with a machine id — up to your plan's activation limit.
        </p>
      </section>
    </div>
  );
}
