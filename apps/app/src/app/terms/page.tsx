import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms governing use of the Slipstream UI dashboard.',
};

/**
 * In-app terms surface. The canonical Terms of Service lives on the docs
 * domain; this page summarizes the dashboard-specific points and links to
 * the full text.
 */
export default function TermsPage() {
  return (
    <main id="main" className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <div>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Slipstream Dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-muted-foreground">
          The full terms are at{' '}
          <a
            href="https://slipstreamui.com/terms"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            slipstreamui.com/terms
          </a>
          . This page covers the dashboard-specific points.
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Accounts</h2>
        <p className="text-sm text-muted-foreground">
          You are responsible for your credentials and for activity under your
          account. Keep your password confidential; we store only a salted
          hash. Notify us promptly of any unauthorized use.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Licenses and billing</h2>
        <p className="text-sm text-muted-foreground">
          Paid plans are billed through Stripe on the cycle shown at checkout.
          You can cancel at any time; in Stripe mode cancellation takes effect
          at the end of the current billing period. License keys are for your
          own use within the scope of your plan and are not redistributable.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Acceptable use</h2>
        <p className="text-sm text-muted-foreground">
          Do not misuse the service: no attempting to breach or overload it,
          scrape it at abusive rates, or use it for unlawful purposes. We may
          suspend accounts that violate these terms.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Availability and changes</h2>
        <p className="text-sm text-muted-foreground">
          The service is provided as-is. We may update these terms; material
          changes are announced and the version you accepted at signup is
          recorded on your account.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Contact</h2>
        <p className="text-sm text-muted-foreground">
          Questions about these terms:{' '}
          <a
            href="https://slipstreamui.com/terms"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            see the full policy
          </a>
          .
        </p>
      </section>
    </main>
  );
}
