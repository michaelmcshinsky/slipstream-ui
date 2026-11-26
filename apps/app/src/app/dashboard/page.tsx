import type { Metadata } from 'next';
import { prisma } from '@slipstream-ui/db';
import { getSessionUser } from '@/lib/session';
import { Stat } from '@/components/ui';
import Link from 'next/link';


export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your Slipstream UI license, usage and billing at a glance.',
};
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = (await getSessionUser())!;
  const [memberships, dbUser, pendingInvites] = await Promise.all([
    prisma.membership.findMany({
      where: { userId: user.id },
      include: { team: { include: { subscription: true, licenseKeys: true } } },
    }),
    prisma.user.findUnique({ where: { id: user.id }, select: { emailVerifiedAt: true } }),
    prisma.teamInvite.count({
      where: { email: user.email, acceptedAt: null, expiresAt: { gt: new Date() } },
    }),
  ]);

  const activeLicenseCount = memberships.reduce(
    (sum, m) => sum + m.team.licenseKeys.filter((license) => license.status === 'ACTIVE').length,
    0
  );
  const paidTeam = memberships.find((m) => m.team.subscription && m.team.subscription.plan !== 'FREE');
  const emailVerified = !!dbUser?.emailVerifiedAt;

  const checklist = [
    {
      label: 'Verify your email',
      done: emailVerified,
      href: emailVerified ? null : '/verify-email',
      hint: 'Required to accept team invitations.',
    },
    {
      label: 'Join or create a team',
      done: memberships.length > 0,
      href: memberships.length > 0 ? null : '/dashboard/team',
      hint: 'Teams hold licenses, seats and billing.',
    },
    {
      label: 'Get a license key',
      done: activeLicenseCount > 0,
      href: activeLicenseCount > 0 ? null : '/dashboard/licenses',
      hint: 'Activate the CLI and MCP server with your key.',
    },
  ];
  const onboardingDone = checklist.every((step) => step.done);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back{user.name ? `, ${user.name}` : ''}</h1>
        <p className="mt-1 text-muted-foreground">Manage your Slipstream UI license, team, and billing.</p>
      </div>

      {!emailVerified && (
        <p role="status" className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          Your email is not verified yet —{' '}
          <Link href="/verify-email" className="font-medium text-primary hover:underline">
            verify it now
          </Link>{' '}
          to accept team invitations.
        </p>
      )}
      {pendingInvites > 0 && (
        <p role="status" className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
          You have {pendingInvites} pending team {pendingInvites === 1 ? 'invitation' : 'invitations'} — check your email for the accept link.
        </p>
      )}

      {!onboardingDone && (
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Get started</h2>
          <ul className="mt-3 space-y-2">
            {checklist.map((step) => (
              <li key={step.label} className="flex items-start gap-3 text-sm">
                <span
                  aria-hidden
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                    step.done ? 'border-success bg-success/15 text-success' : 'border-border text-muted-foreground'
                  }`}
                >
                  {step.done ? '✓' : ''}
                </span>
                <div>
                  {step.href ? (
                    <Link href={step.href} className="font-medium text-primary hover:underline">
                      {step.label}
                    </Link>
                  ) : (
                    <span className="font-medium">{step.label}</span>
                  )}
                  <span className="ml-2 text-xs text-muted-foreground">{step.hint}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

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
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/team?team=${membership.team.id}`}
                  className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
                >
                  Manage team
                </Link>
                <Link
                  href={`/dashboard/billing?teamId=${membership.team.id}`}
                  className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
                >
                  Manage billing
                </Link>
              </div>
            </div>
          ))}
          {memberships.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No teams yet —{' '}
              <Link href="/dashboard/team" className="font-medium text-primary hover:underline">
                create one
              </Link>{' '}
              or accept a pending invite.
            </p>
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
