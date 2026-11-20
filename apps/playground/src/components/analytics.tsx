import { useEffect } from 'react';
import {
  CONSENT_EVENT,
  GA_MEASUREMENT_ID,
  GA_SCRIPT_SRC,
  installGtag,
  readConsent,
  type ConsentValue,
} from '../lib/analytics';

/**
 * Consent-gated analytics loader.
 *
 * Google Analytics 4 loads for GA_MEASUREMENT_ID only after the visitor
 * accepts cookies. Nothing is injected until then, and the tag is only added
 * once per page load.
 */
export function Analytics() {
  useEffect(() => {
    const load = (consent: ConsentValue | null) => {
      if (consent !== 'granted') {
        // Withdrawal must take effect without a reload: remove the tag and set
        // GA's documented opt-out flag so the already-initialised tracker
        // stops sending.
        document.querySelectorAll('script[data-slipstream-analytics="true"]').forEach((node) => node.remove());
        (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
        return;
      }
      (window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
      if (document.querySelector('script[data-slipstream-analytics="true"]')) return;

      // gtag.js drains dataLayer on load, so queue the config first.
      installGtag();
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = GA_SCRIPT_SRC;
      gtagScript.dataset.slipstreamAnalytics = 'true';
      document.head.appendChild(gtagScript);
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
