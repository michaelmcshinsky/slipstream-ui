'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardTitle, inputClass } from '@/components/ui';
import { useBilling } from './use-billing';

export default function BillingPage() {
  const searchParams = useSearchParams();
  const {
    teams, activeTeamId, subscription, plans, error, pendingPlan, canceling,
    loading, loadingSubscription, canCheckout, canCancel, selectTeam, checkout, cancel, retry,
  } = useBilling(searchParams.get('teamId'));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        {teams.length > 0 && (
          <select
            value={activeTeamId ?? ''}
            onChange={(event) => void selectTeam(event.target.value)}
            disabled={loading || pendingPlan !== null || canceling}
            aria-label="Team"
            className={inputClass + ' max-w-56'}
          >
            {!activeTeamId && <option value="" disabled>Select a team</option>}
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        )}
      </div>

      {error && (
        <div className="space-y-2">
          <p role="alert" className="text-sm text-destructive">{error}</p>
          <button
            type="button"
            onClick={() => void retry()}
            disabled={loading || loadingSubscription || pendingPlan !== null || canceling}
            className="text-sm underline disabled:opacity-50"
          >
            Reload billing
          </button>
        </div>
      )}
      <p role="status" className="text-sm text-muted-foreground">
        {loading ? 'Loading billing…' : loadingSubscription ? 'Loading subscription…' : pendingPlan ? 'Opening checkout…' : canceling ? 'Canceling subscription…' : ''}
      </p>
      {!loading && !error && teams.length === 0 && (
        <p className="text-sm text-muted-foreground">No teams available for billing.</p>
      )}

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
              onClick={() => void cancel()}
              disabled={!canCancel}
              className="mt-3 text-sm text-destructive hover:underline disabled:opacity-50"
            >
              {canceling ? 'Canceling…' : 'Cancel subscription'}
            </button>
          )}
        </Card>
      )}

      <section aria-busy={loading}>
        <h2 className="mb-4 text-lg font-semibold">Plans</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => {
            const current = subscription?.plan === plan.id;
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
                ) : plan.id !== 'FREE' ? (
                  <button
                    type="button"
                    onClick={() => void checkout(plan.id)}
                    disabled={!canCheckout}
                    className="mt-4 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {pendingPlan === plan.id ? 'Opening checkout…' : `Upgrade to ${plan.name}`}
                  </button>
                ) : (
                  <span />
                )}
              </div>
            );
          })}
        </div>
      </section>

      <Card>
        <CardTitle>Payment history</CardTitle>
        <p className="text-sm text-muted-foreground">Payment history is not available yet.</p>
      </Card>
    </div>
  );
}
