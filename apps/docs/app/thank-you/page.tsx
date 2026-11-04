import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingPage } from '@/components/site/marketing-page';

export const metadata: Metadata = {
  title: 'Message received',
  description: 'Thanks — your message reached the Slipstream UI maintainers.',
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <MarketingPage
      title="Message received"
      description="Thanks for reaching out — we read every message and reply within two business days."
    >
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">What happens next</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6">
          <li>We confirm receipt by email if you included a reachable address.</li>
          <li>Bug reports are triaged on GitHub; features are added to the roadmap discussion.</li>
          <li>If we need more detail, we reply directly to your message.</li>
        </ol>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/docs"
          className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Read the docs
        </Link>
        <Link
          href="/docs/components"
          className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm font-medium hover:bg-accent"
        >
          Browse components
        </Link>
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-md px-5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Back home
        </Link>
      </div>
    </MarketingPage>
  );
}
