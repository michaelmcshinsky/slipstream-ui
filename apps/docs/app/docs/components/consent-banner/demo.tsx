'use client';

import { useState } from 'react';
import { ConsentBanner, useConsent } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

const DEMO_KEY = 'slipstream-docs-consent-demo';

function LiveConsent() {
  const consent = useConsent({ storageKey: DEMO_KEY, purposes: ['analytics'] });
  const [managing, setManaging] = useState(false);

  if (consent.decided && !managing) {
    return (
      <div className="flex flex-col items-start gap-3 p-4">
        <p className="text-sm text-muted-foreground">
          Decision stored: analytics {consent.preferences?.analytics ? 'granted' : 'denied'}.
        </p>
        <button
          type="button"
          onClick={consent.clear}
          className="text-sm font-medium text-primary underline underline-offset-2"
        >
          Reset consent (show banner again)
        </button>
      </div>
    );
  }

  return (
    <ConsentBanner
      className="static"
      title="We use cookies"
      onAccept={() => {
        consent.setAll(true);
        setManaging(false);
      }}
      onDecline={() => {
        consent.setAll(false);
        setManaging(false);
      }}
      onManage={() => setManaging(true)}
    >
      We use cookies for analytics to understand how the docs are used. See our{' '}
      <a href="/privacy" className="text-primary underline underline-offset-2">
        privacy policy
      </a>
      .
    </ConsentBanner>
  );
}

export default function Demo() {
  return (
    <>
      <DemoCard
        title="With useConsent"
        preview={
          <div className="w-full overflow-hidden rounded-lg border border-border">
            <LiveConsent />
          </div>
        }
        code={`const consent = useConsent({ purposes: ['analytics'] });

{!consent.decided && (
  <ConsentBanner
    title="We use cookies"
    onAccept={() => consent.setAll(true)}
    onDecline={() => consent.setAll(false)}
    onManage={() => openPreferences()}
  >
    We use cookies for analytics.{' '}
    <a href="/privacy">Privacy policy</a>
  </ConsentBanner>
)}`}
        usage={`// useConsent persists { analytics: boolean } in localStorage with a
// 180-day expiry and syncs every hook instance on the page (and other tabs).
// Read consent.preferences?.analytics — not decided — to gate trackers, so a
// denied visitor and an undecided one stay distinct.`}
        types={`type UseConsentOptions = {
  storageKey?: string;   // default 'slipstream-consent'
  purposes?: string[];   // default ['analytics']
  maxAgeMs?: number;     // default 180 days
};

type Consent = {
  preferences: Record<string, boolean> | null;
  decided: boolean;
  setAll(allowed: boolean): void;
  set(preferences: Record<string, boolean>): void;
  clear(): void;
};`}
      />
      <DemoCard
        title="Custom labels and manage action"
        preview={
          <div className="w-full overflow-hidden rounded-lg border border-border">
            <ConsentBanner
              className="static"
              label="Einwilligung"
              title="Cookies"
              acceptLabel="Alle akzeptieren"
              declineLabel="Ablehnen"
              manageLabel="Einstellungen"
              onAccept={() => {}}
              onDecline={() => {}}
              onManage={() => {}}
            >
              Wir verwenden Cookies für anonyme Reichweitenmessung.
            </ConsentBanner>
          </div>
        }
        code={`<ConsentBanner
  label="Einwilligung"
  title="Cookies"
  acceptLabel="Alle akzeptieren"
  declineLabel="Ablehnen"
  manageLabel="Einstellungen"
  onAccept={acceptAll}
  onDecline={declineAll}
  onManage={openPreferences}
>
  Wir verwenden Cookies für anonyme Reichweitenmessung.
</ConsentBanner>`}
        usage={`// Localize label, title and all three button labels — the region's
// accessible name comes from label, not the visible copy.`}
      />
    </>
  );
}
