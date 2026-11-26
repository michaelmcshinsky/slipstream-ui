import type { Metadata } from 'next';
import Link from 'next/link';
import { PrivacyPreferences } from '@/components/privacy-preferences';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What the Slipstream UI dashboard stores and how it is used.',
};

/**
 * In-app privacy surface. The canonical policy lives on the docs domain;
 * this page is the app-scoped summary covering accounts, billing, email,
 * audit logs, cookies, retention, and subprocessors so account holders can
 * see the dashboard-specific practices without leaving the product.
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

      <PrivacyPreferences />

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Account data</h2>
        <p className="text-sm text-muted-foreground">
          We store your email address, display name, and a salted password
          hash (never plaintext). If you accepted the terms at signup, the
          document version and timestamp are recorded on your account. Login
          sessions are cookie-based and expire after a period of inactivity
          or a maximum lifetime, whichever comes first. Password-reset and
          email-verification tokens are single-use and short-lived.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Licenses, teams, API keys, and billing</h2>
        <p className="text-sm text-muted-foreground">
          License keys, team memberships and roles, API keys, and subscription
          state are stored to provide the product. Payments are processed by
          Stripe — card details go directly to Stripe and never touch our
          servers. We store the Stripe customer and subscription identifiers
          needed to reconcile billing, plus the plan metadata captured at
          checkout.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Email and newsletter</h2>
        <p className="text-sm text-muted-foreground">
          Transactional email (verification, invites, password resets,
          receipts) is sent on your behalf through the configured email
          gateway, which receives the recipient, subject, and body. Delivery
          records are retained for a limited period. Newsletter digests are
          only sent if you subscribe, and every message includes a one-click
          unsubscribe link and your local send-window timezone preference.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Audit log and admin access</h2>
        <p className="text-sm text-muted-foreground">
          Security-relevant actions (sign-ins, license changes, team edits,
          billing operations, admin actions) are written to an audit log
          retained for up to two years. Administrators can impersonate user
          accounts for support; impersonation sessions are time-boxed and
          every action taken during impersonation is stamped in the audit
          log with both the admin and the impersonated user.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Cookies and similar storage</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>
            <code>slipstream_session</code> — strictly necessary sign-in
            session cookie.
          </li>
          <li>
            <code>slipstream_impersonator</code> — strictly necessary cookie
            that parks the admin session while impersonating a user; expires
            after one hour.
          </li>
          <li>
            <code>slipstream-consent</code> — your cookie preferences, stored
            in localStorage (not a cookie), expires after 180 days.
          </li>
          <li>
            <code>slipstream-theme</code> and <code>slipstream-locale</code> —
            UI preferences in localStorage/cookies; no tracking.
          </li>
          <li>
            <code>_ga</code> cookies — set only if you enable analytics
            above and a GA4 property is configured; Google receives
            aggregated usage data subject to its own policy.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Retention</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Sessions: expire on inactivity or the absolute session cap.</li>
          <li>Password-reset and email-verification tokens: hours to days.</li>
          <li>Email and newsletter delivery records: up to 180 days.</li>
          <li>Audit log: up to 730 days (2 years).</li>
          <li>Account, license, team, and preference records: kept while your
            account is active.</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          A scheduled retention job purges expired records automatically.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Subprocessors</h2>
        <p className="text-sm text-muted-foreground">
          Data may be processed by: Stripe (payments), Google (GA4
          analytics, only if you opt in), the configured transactional-email
          gateway, the application and database hosting providers for this
          deployment, and Cloudflare (docs site hosting). The email gateway
          is whatever <code>EMAIL_WEBHOOK_URL</code> points at — check your
          deployment configuration for the specific provider.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Your controls</h2>
        <p className="text-sm text-muted-foreground">
          You can update your profile, change your password, manage newsletter
          subscriptions and cookie preferences above, and leave teams from the
          dashboard. To delete your account or export your data, contact us
          via the details in the{' '}
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
