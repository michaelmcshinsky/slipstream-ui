'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CONSENT_EVENT,
  readConsent,
  writeConsent,
  type ConsentValue,
} from '@/lib/site';

/**
 * Cookie consent banner. Analytics is only loaded after "Accept all"
 * (see components/site/analytics.tsx); "Decline" keeps the site fully
 * functional - only the theme preference is stored.
 *
 * The banner is rendered during SSR so it paints with the page instead of
 * becoming a late (post-hydration) LCP candidate. Repeat visitors are hidden
 * before first paint by the `consent-decided` class the theme script adds.
 */
export function CookieBanner() {
  const [consent, setConsent] = useState<ConsentValue | null>(null);

  useEffect(() => {
    setConsent(readConsent());
    const onChange = (event: Event) => {
      setConsent((event as CustomEvent<ConsentValue>).detail);
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (consent !== null) return null;

  const choose = (value: ConsentValue) => {
    writeConsent(value);
    setConsent(value);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      data-cookie-banner
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-border bg-card px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-lg sm:px-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Privacy-friendly analytics only with consent. No ads, no cross-site tracking. Read the{' '}
          <Link href="/privacy" className="text-primary underline underline-offset-2 hover:text-primary/80">
            privacy policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose('denied')}
            className="inline-flex h-11 items-center rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose('granted')}
            className="inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
