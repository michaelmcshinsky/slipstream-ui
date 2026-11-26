import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What the Slipstream UI dashboard stores and how it is used.',
};

/**
 * In-app privacy surface (IMP-WEB-014). The canonical policy lives on the
 * docs domain; this page summarizes the app-specific data practices so
 * account holders can see them without leaving the product.
 */
export default function PrivacyPage() {
  return (
    <main id="main" className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <div>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Slipstream Dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Privacy</h1>
        <p className="mt-2 text-muted-foreground">
          What this dashboard stores and why. The full policy is at{' '}
          <a
            href="https://slipstreamui.com/privacy"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            slipstreamui.com/privacy
          </a>
          .
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Account data</h2>
        <p className="text-sm text-muted-foreground">
          We store your email address, display name, and a hashed password
          (never plaintext). Sessions are cookie-based and expire after a
          period of inactivity or a maximum lifetime, whichever comes first.
          Email addresses are checked against the Have I Been Pwned breach
          corpus by hash prefix only — the password itself is never sent.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Licenses, teams, and billing</h2>
        <p className="text-sm text-muted-foreground">
          License keys, team memberships, and subscription state are stored to
          provide the product. Payments are processed by Stripe — card details
          go directly to Stripe and never touch our servers. We store the
          Stripe customer and subscription identifiers needed to reconcile
          billing.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Email and newsletter</h2>
        <p className="text-sm text-muted-foreground">
          Transactional email (verification, invites, password resets,
          receipts) is sent on your behalf. Newsletter digests are only sent
          if you subscribe, and every message includes a one-click unsubscribe
          link. Newsletter preferences — including your timezone — are stored
          so sends arrive at a reasonable local time.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Audit log and analytics</h2>
        <p className="text-sm text-muted-foreground">
          Security-relevant actions (sign-ins, license changes, team edits,
          admin operations) are written to an audit log retained for up to
          two years. Product analytics are off unless you accept cookies via
          the consent banner; declining keeps the app fully functional.
          Delivery and snapshot records are purged on a retention schedule.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Your controls</h2>
        <p className="text-sm text-muted-foreground">
          You can update your profile, change your password, manage newsletter
          subscriptions, and leave teams from the dashboard. To delete your
          account or export your data, contact us via the details in the{' '}
          <a
            href="https://slipstreamui.com/privacy"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            privacy policy
          </a>
          .
        </p>
      </section>
    </main>
  );
}
