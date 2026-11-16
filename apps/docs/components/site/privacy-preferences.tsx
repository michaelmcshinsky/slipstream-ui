'use client';

import { useEffect, useState } from 'react';
import { CONSENT_EVENT, clearConsent, readConsent, writeConsent, type ConsentValue } from '@/lib/site';
import { track } from '@/lib/analytics';

/**
 * Persistent consent control. Withdrawing consent used to require clearing
 * site data; this makes the choice reversible from the privacy page and keeps
 * the analytics loader in sync through the shared consent event.
 */
export function PrivacyPreferences() {
  const [consent, setConsent] = useState<ConsentValue | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setReady(true);
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<ConsentValue | null>).detail;
      setConsent(detail ?? readConsent());
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  function choose(value: ConsentValue) {
    writeConsent(value);
    setConsent(value);
    track('consent', { choice: value, location: 'privacy_preferences' });
  }

  function reset() {
    clearConsent();
    setConsent(null);
    track('consent', { choice: 'reset', location: 'privacy_preferences' });
  }

  const status = !ready
    ? 'Checking your current choice…'
    : consent === 'granted'
      ? 'Analytics is currently on.'
      : consent === 'denied'
        ? 'Analytics is currently off.'
        : 'You have not chosen yet; analytics is off.';

  return (
    <section
      id="preferences"
      aria-labelledby="privacy-preferences-heading"
      className="rounded-xl border border-border bg-card p-4 text-foreground"
    >
      <h2 id="privacy-preferences-heading" className="text-base font-semibold">
        Privacy preferences
      </h2>
      <p className="mt-1 text-sm text-muted-foreground" role="status">
        {status}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => choose('granted')}
          aria-pressed={consent === 'granted'}
          className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Accept analytics
        </button>
        <button
          type="button"
          onClick={() => choose('denied')}
          aria-pressed={consent === 'denied'}
          className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Decline analytics
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-9 items-center rounded-md px-3 text-sm text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
        >
          Reset choice
        </button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        The theme preference and this choice are stored in your browser only. Resetting removes the analytics cookies
        Slipstream set; see the policy above for details.
      </p>
    </section>
  );
}
