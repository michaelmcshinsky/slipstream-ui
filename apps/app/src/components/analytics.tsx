'use client';

import { useEffect } from 'react';
import {
  CONSENT_EVENT,
  GA_MEASUREMENT_ID,
  GA_SCRIPT_SRC,
  installGtag,
  readConsent,
  updateConsentMode,
  type ConsentPreferences,
} from '@/lib/analytics';

/**
 * Consent-gated analytics loader.
 *
 * Google Analytics 4 loads for GA_MEASUREMENT_ID only after the `analytics`
 * purpose is granted. Nothing is injected until then, Consent Mode v2
 * defaults/updates are queued before the config, and the tag is only added
 * once per page load.
 */
export function Analytics() {
  useEffect(() => {
    // No dedicated app property configured: analytics stays fully disabled
    // rather than reporting into the docs site's GA4 property.
    if (!GA_MEASUREMENT_ID) return;

    const load = (consent: ConsentPreferences | null) => {
      const analyticsAllowed = consent?.analytics === true;
      if (!analyticsAllowed) {
        // Withdrawal must take effect without a reload: tell Consent Mode the
        // storage signals are denied, remove the tag, and set GA's documented
        // opt-out flag so the already-initialised tracker stops sending hits.
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
