'use client';

import { useEffect } from 'react';
import { CONSENT_EVENT, readConsent, type ConsentPreferences } from '@/lib/site';
import { GA_SCRIPT_SRC, GA_MEASUREMENT_ID, installGtag, updateConsentMode } from '@/lib/analytics';

/**
 * Consent-gated analytics loader.
 *
 * Two configurations, in precedence order:
 * - `NEXT_PUBLIC_ANALYTICS_SRC` (plus optional `NEXT_PUBLIC_ANALYTICS_DOMAIN`)
 *   loads a Plausible-style script.
 * - Otherwise Google Analytics 4 loads for `GA_MEASUREMENT_ID`.
 *
 * GA4 only loads when the `analytics` purpose is granted; other purposes can
 * be toggled independently in PrivacyPreferences. Plausible is a single-purpose
 * vendor, so it follows the same analytics gate. The tag is only added once
 * per page load.
 */
export function Analytics() {
  useEffect(() => {
    const plausibleSrc = process.env.NEXT_PUBLIC_ANALYTICS_SRC;
    const plausibleDomain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
    // Plausible requires data-domain on the tag; a missing domain makes the
    // script load but record nothing, so fall back to GA4 instead.
    if (plausibleSrc && !plausibleDomain) {
      console.warn('[analytics] NEXT_PUBLIC_ANALYTICS_SRC set without NEXT_PUBLIC_ANALYTICS_DOMAIN; using GA4.');
    }

    const load = (consent: ConsentPreferences | null) => {
      const analyticsAllowed = consent?.analytics === true;
      if (!analyticsAllowed) {
        // Withdrawal must take effect without a reload: tell Consent Mode the
        // storage signals are denied (cookieless pings may continue per Google's
        // modeling), remove the tag, and set GA's documented opt-out flag so
        // the already-initialised tracker stops sending hits entirely.
        updateConsentMode(consent);
        document.querySelectorAll('script[data-slipstream-analytics="true"]').forEach((node) => node.remove());
        (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
        return;
      }
      (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
      // Sync Consent Mode even when the tag is already loaded - a purpose
      // toggle must reach gtag without a reload.
      updateConsentMode(consent);
      if (document.querySelector('script[data-slipstream-analytics="true"]')) return;

      if (plausibleSrc && plausibleDomain) {
        const script = document.createElement('script');
        script.defer = true;
        script.src = plausibleSrc;
        script.dataset.slipstreamAnalytics = 'true';
        script.dataset.domain = plausibleDomain;
        document.head.appendChild(script);
        return;
      }

      // gtag.js drains dataLayer on load, so queue consent defaults, the
      // consent update, and the config first.
      installGtag(consent);
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = GA_SCRIPT_SRC;
      gtagScript.dataset.slipstreamAnalytics = 'true';
      document.head.appendChild(gtagScript);
    };

    load(readConsent());

    const onChange = (event: Event) => {
      load((event as CustomEvent<ConsentPreferences | null>).detail);
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  return null;
}
