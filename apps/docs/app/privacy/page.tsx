import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingPage } from '@/components/site/marketing-page';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description:
    'What Slipstream UI stores on your device, what analytics we use (only with consent), how contact messages are handled, and how to exercise your privacy rights.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <MarketingPage
      title="Privacy policy"
      description="Short version: we store your theme preference, we only measure traffic if you accept cookies, and we never run ads or cross-site tracking."
      updated="November 2026"
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">What we store on your device</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">slipstream-theme</code> — your light/dark
            preference, so the site doesn&apos;t flash the wrong theme.
          </li>
          <li>
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">slipstream-consent</code> — your cookie
            choice, so we don&apos;t ask again.
          </li>
        </ul>
        <p>Neither value is sent to a server. Clearing site data resets both.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Analytics</h2>
        <p>
          Analytics is <strong className="text-foreground">off by default</strong>. If you choose “Accept all”, we load
          a privacy-friendly analytics script that records aggregate page views (URL, referrer, coarse device/browser
          information). We do not use advertising cookies, fingerprinting, or cross-site profiles.
        </p>
        <p>
          You can withdraw consent at any time by clearing this site&apos;s data in your browser; the banner will
          appear again on your next visit.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Contact messages</h2>
        <p>
          When you use the contact form we receive the name, email address and message you submit. Form submissions are
          processed by our hosting provider (Netlify Forms) and are used only to reply to you. We keep them for up to
          24 months.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Hosting logs</h2>
        <p>
          Our hosting provider records standard request logs (IP address, user agent, requested URL) for security and
          abuse prevention, retained according to their policy.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">What we do not do</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>No advertising or retargeting pixels.</li>
          <li>No selling or renting of personal data.</li>
          <li>No account, newsletter or tracking profiles on this documentation site.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Your rights</h2>
        <p>
          Depending on where you live you may have the right to access, correct, export or delete personal data we
          hold about you, and to object to processing. Email{' '}
          <a className="text-primary hover:underline" href={`mailto:${SITE.contact.email}`}>
            {SITE.contact.email}
          </a>{' '}
          and we will respond within 30 days. You can also lodge a complaint with your local supervisory authority.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Children</h2>
        <p>The site is a developer resource and is not directed at children under 16.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Changes</h2>
        <p>
          We will update this page and its “last updated” date when practices change. See also our{' '}
          <Link href="/terms" className="text-primary hover:underline">
            terms of use
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Contact</h2>
        <address className="not-italic">
          {SITE.contact.address.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
          <a className="text-primary hover:underline" href={`mailto:${SITE.contact.email}`}>
            {SITE.contact.email}
          </a>
        </address>
      </section>
    </MarketingPage>
  );
}
