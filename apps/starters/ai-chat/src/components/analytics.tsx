'use client';

import { useEffect } from 'react';
import { GA_SCRIPT_SRC, installGtag } from '@/src/lib/google-analytics';

/**
 * Loads GA4 when NEXT_PUBLIC_GA_MEASUREMENT_ID is configured. The deployer is
 * responsible for consent before setting that variable - see
 * src/lib/google-analytics.ts.
 */
export function Analytics() {
  useEffect(() => {
    if (!GA_SCRIPT_SRC || document.querySelector('script[data-slipstream-analytics="true"]')) return;

    // gtag.js drains dataLayer on load, so queue the config first.
    installGtag();
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = GA_SCRIPT_SRC;
    gtagScript.dataset.slipstreamAnalytics = 'true';
    document.head.appendChild(gtagScript);
  }, []);

  return null;
}
