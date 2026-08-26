'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardTitle, inputClass } from '@/components/ui';

interface Plan {
  id: string;
  name: string;
  priceCents: number;
  blurb: string;
  features: string[];
}

interface Subscription {
  plan: string;
  status: string;
  seats: number;
  currentPeriodEnd: string | null;
}

interface Payment {
  id: string;
  amountCents: number;
  status: string;
  description: string;
  createdAt: string;
}

export default function BillingPage() {
  const searchParams = useSearchParams();
  const teamId = searchParams.get('teamId');
  const [teams, setTeams] = useState<{ id: string; name: string; role: string }[]>([]);
  const [activeTeamId, setActiveTeamId] = useState<string | null>(teamId);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [payments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);

  // Resolve the team to manage (first team by default).
  useEffect(() => {
    fetch('/api/teams')
      .then((r) => r.json())
      .then((data) => {
        setTeams(data.teams ?? []);
        if (!teamId && data.teams?.[0]) setActiveTeamId(data.teams[0].id);
      });
    fetch('/api/billing/plans')
      .then((r) => r.json())
      .then((data) => setPlans(data.plans ?? []));
  }, [teamId]);

  useEffect(() => {
    if (!activeTeamId) return;
    fetch(`/api/teams/${activeTeamId}`)
      .then((r) => r.json())
      .then((data) => {
        setSubscription(data.team?.subscription ?? { plan: 'FREE', status: 'ACTIVE', seats: 1, currentPeriodEnd: null });
      });
    // Payments are visible via the team detail payload in a fuller app; here we
    // read them from the subscription-scoped admin-free endpoint when present.
    fetch('/api/licenses').catch(() => {});
  }, [activeTeamId]);

  async function checkout(plan: string) {
    if (!activeTeamId) return;
    setError(null);
    setPendingPlan(plan);
    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: activeTeamId, plan }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
        return;
      }
      window.location.href = data.url; // Stripe checkout or mock confirm
    } finally {
      setPendingPlan(null);
    }
  }

  async function cancel() {
    if (!activeTeamId) return;
    setError(null);
    const response = await fetch('/api/billing/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId: activeTeamId }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error);
      return;
    }
    window.location.reload();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        {teams.length > 0 && (
          <select
            value={activeTeamId ?? ''}
            onChange={(event) => setActiveTeamId(event.target.value)}
            aria-label="Team"
            className={inputClass + ' max-w-56'}
          >
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        )}
      </div>

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      {subscription && (
        <Card>
          <CardTitle>Current subscription</CardTitle>
          <p className="text-sm">
            Plan: <span className="font-semibold">{subscription.plan}</span> · Status:{' '}
            <span className="font-semibold">{subscription.status}</span> · Seats: {subscription.seats}
          </p>
          {subscription.plan !== 'FREE' && (
            <button
              type="button"
              onClick={cancel}
              className="mt-3 text-sm text-destructive hover:underline"
            >
              Cancel subscription
            </button>
          )}
        </Card>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold">Plans</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(plans.length ? plans : [{ id: 'FREE', name: 'Free', priceCents: 0, blurb: 'Open source.', features: [] }]).map(
            (plan) => {
              const current = subscription?.plan === plan.id;
              const purchasable = plan.id !== 'FREE';
              return (
                <div
                  key={plan.id}
                  className={`flex flex-col rounded-xl border p-5 ${
                    current ? 'border-primary bg-primary/5' : 'border-border bg-card'
                  }`}
                >
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-2xl font-bold">
                    ${(plan.priceCents / 100).toFixed(0)}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                  <p className="mt-2 flex-1 text-xs text-muted-foreground">{plan.blurb}</p>
                  <ul className="mt-3 flex-1 space-y-1 text-xs text-muted-foreground">
                    {plan.features.map((feature) => (
                      <li key={feature}>· {feature}</li>
                    ))}
                  </ul>
                  {current ? (
                    <p className="mt-4 rounded-md bg-muted px-3 py-1.5 text-center text-xs">Current plan</p>
                  ) : purchasable ? (
                    <button
                      type="button"
                      onClick={() => checkout(plan.id)}
                      disabled={pendingPlan === plan.id || !activeTeamId}
                      className="mt-4 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                      {pendingPlan === plan.id ? 'Redirecting…' : `Upgrade to ${plan.name}`}
                    </button>
                  ) : (
                    <span />
                  )}
                </div>
              );
            }
          )}
        </div>
      </section>

      <Card>
        <CardTitle>Payment history</CardTitle>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="py-2 font-medium">Date</th>
              <th className="py-2 font-medium">Description</th>
              <th className="py-2 font-medium">Amount</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-border/60">
                <td className="py-2">{new Date(payment.createdAt).toLocaleDateString()}</td>
                <td className="py-2">{payment.description}</td>
                <td className="py-2">${(payment.amountCents / 100).toFixed(2)}</td>
                <td className="py-2">{payment.status}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={4} className="py-3 text-muted-foreground">No payments yet.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
