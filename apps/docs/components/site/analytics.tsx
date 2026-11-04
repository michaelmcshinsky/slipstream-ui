'use client';

import { useEffect } from 'react';
import { CONSENT_EVENT, readConsent, type ConsentValue } from '@/lib/site';

/**
 * Consent-gated analytics loader.
 *
 * Set `NEXT_PUBLIC_ANALYTICS_SRC` (script URL) and optionally
 * `NEXT_PUBLIC_ANALYTICS_DOMAIN` (e.g. for Plausible) in the environment to
 * enable. Nothing is injected until the visitor accepts cookies, and the
 * script is only added once per page load.
 */
export function Analytics() {
  useEffect(() => {
    const src = process.env.NEXT_PUBLIC_ANALYTICS_SRC;
    if (!src) return;

    const load = (consent: ConsentValue | null) => {
      if (consent !== 'granted') return;
      if (document.querySelector(`script[data-slipstream-analytics="true"]`)) return;
      const script = document.createElement('script');
      script.defer = true;
      script.src = src;
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
