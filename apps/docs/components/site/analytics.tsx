'use client';

import { useEffect } from 'react';
import { CONSENT_EVENT, readConsent, type ConsentValue } from '@/lib/site';
import { GA_SCRIPT_SRC, GA_MEASUREMENT_ID, installGtag } from '@/lib/analytics';

/**
 * Consent-gated analytics loader.
 *
 * Two configurations, in precedence order:
 * - `NEXT_PUBLIC_ANALYTICS_SRC` (plus optional `NEXT_PUBLIC_ANALYTICS_DOMAIN`)
 *   loads a Plausible-style script.
 * - Otherwise Google Analytics 4 loads for `GA_MEASUREMENT_ID`.
 *
 * Nothing is injected until the visitor accepts cookies, and the tag is only
 * added once per page load.
 */
export function Analytics() {
  useEffect(() => {
    const plausibleSrc = process.env.NEXT_PUBLIC_ANALYTICS_SRC;

    const load = (consent: ConsentValue | null) => {
      if (consent !== 'granted') {
        // Withdrawal must take effect without a reload: remove the tag and set
        // GA's documented opt-out flag so the already-initialised tracker
        // stops sending. `track()` also gates on stored consent.
        document.querySelectorAll('script[data-slipstream-analytics="true"]').forEach((node) => node.remove());
        (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
        return;
      }
      (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
      if (document.querySelector('script[data-slipstream-analytics="true"]')) return;

      if (!plausibleSrc) {
        // gtag.js drains dataLayer on load, so queue the config first.
        installGtag();
        const gtagScript = document.createElement('script');
        gtagScript.async = true;
        gtagScript.src = GA_SCRIPT_SRC;
        gtagScript.dataset.slipstreamAnalytics = 'true';
        document.head.appendChild(gtagScript);
        return;
      }

      const script = document.createElement('script');
      script.defer = true;
      script.src = plausibleSrc;
      script.dataset.slipstreamAnalytics = 'true';
      const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
      if (domain) script.dataset.domain = domain;
      document.head.appendChild(script);
    };

    load(readConsent());

    const onChange = (event: Event) => {
      load((event as CustomEvent<ConsentValue>).detail);
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  return null;
}
