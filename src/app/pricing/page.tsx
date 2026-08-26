import Link from 'next/link';
import { PLANS } from '@/lib/plans';

export default function PricingPage() {
  return (
    <main className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Pricing</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            The core library is MIT-licensed and free forever. Paid plans unlock premium
            templates, team licensing, and priority support.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col rounded-xl border p-6 ${
                plan.id === 'PRO' ? 'border-primary shadow-md' : 'border-border bg-card'
              }`}
            >
              {plan.id === 'PRO' && (
                <span className="mb-2 w-fit rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Most popular
                </span>
              )}
              <h2 className="font-semibold">{plan.name}</h2>
              <p className="mt-2 text-3xl font-bold">
                ${(plan.priceCents / 100).toFixed(0)}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{plan.blurb}</p>
              <ul className="mt-4 flex-1 space-y-1.5 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature}>· {feature}</li>
                ))}
              </ul>
              {plan.id === 'FREE' ? (
                <Link
                  href="/signup"
                  className="mt-6 rounded-lg border border-border px-4 py-2 text-center text-sm font-medium hover:bg-muted"
                >
                  Start free
                </Link>
              ) : (
                <Link
                  href={`/signup?plan=${plan.id}`}
                  className={`mt-6 rounded-lg px-4 py-2 text-center text-sm font-medium ${
                    plan.id === 'PRO'
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border border-border hover:bg-muted'
                  }`}
                >
                  Get {plan.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Questions? Everything about licensing is documented in the{' '}
          <Link href="/docs" className="font-medium text-primary hover:underline">docs</Link>.
        </p>
      </div>
    </main>
  );
}
