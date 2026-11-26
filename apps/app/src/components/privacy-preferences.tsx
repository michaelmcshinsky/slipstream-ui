'use client';

import { useEffect, useState } from 'react';
import {
  CONSENT_EVENT,
  CONSENT_PURPOSES,
  clearConsent,
  consentForAll,
  readConsent,
  writeConsent,
  type ConsentPreferences,
  type ConsentPurpose,
} from '@/lib/analytics';

const PURPOSE_LABELS: Record<ConsentPurpose, string> = {
  analytics: 'Analytics',
};

const PURPOSE_DESCRIPTIONS: Record<ConsentPurpose, string> = {
  analytics: 'Usage measurements for the dashboard (page views, funnel events). Off by default until you opt in.',
};

/**
 * Per-purpose consent toggles for the dashboard (Consent Mode v2
 * granularity), surfaced on /privacy. Each toggle writes immediately so the
 * analytics loader stays in sync through the shared consent event.
 */
export function PrivacyPreferences() {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPreferences(readConsent());
    setReady(true);
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<ConsentPreferences | null>).detail;
      setPreferences(detail ?? readConsent());
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  const current = preferences ?? consentForAll(false);

  function toggle(purpose: ConsentPurpose) {
    const next = { ...current, [purpose]: !current[purpose] };
    writeConsent(next);
    setPreferences(next);
  }

  function reset() {
    clearConsent();
    setPreferences(null);
  }

  const status = !ready
    ? 'Checking your current choice…'
    : preferences === null
      ? 'You have not chosen yet; all optional purposes are off.'
      : CONSENT_PURPOSES.every((p) => preferences[p])
        ? 'All optional purposes are on.'
        : CONSENT_PURPOSES.every((p) => !preferences[p])
          ? 'All optional purposes are off.'
          : 'Some optional purposes are on.';

  return (
    <section
      aria-labelledby="app-privacy-preferences-heading"
      className="rounded-xl border border-border bg-card p-4"
    >
      <h2 id="app-privacy-preferences-heading" className="text-base font-semibold">
        Cookie preferences
      </h2>
      <p className="mt-1 text-sm text-muted-foreground" role="status">
        {status}
      </p>
      <ul className="mt-3 space-y-2">
        {CONSENT_PURPOSES.map((purpose) => (
          <li key={purpose} className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{PURPOSE_LABELS[purpose]}</p>
              <p className="text-xs text-muted-foreground">{PURPOSE_DESCRIPTIONS[purpose]}</p>
            </div>
            <button
              type="button"
              onClick={() => toggle(purpose)}
              aria-pressed={current[purpose]}
              aria-label={`${PURPOSE_LABELS[purpose]} ${current[purpose] ? 'on' : 'off'}`}
              className={`inline-flex h-8 shrink-0 items-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                current[purpose]
                  ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border-border hover:bg-muted'
              }`}
            >
              {current[purpose] ? 'On' : 'Off'}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-9 items-center rounded-md px-3 text-sm text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
        >
          Reset choice
        </button>
      </div>
    </section>
  );
}
