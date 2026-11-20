/**
 * Optional GA4 pageview tracking.
 *
 * Inactive unless NEXT_PUBLIC_GA_MEASUREMENT_ID is set at build time. Set it
 * only when the deployment has a consent mechanism: gtag.js sets cookies on
 * load, so serving it without consent is a privacy violation in most
 * jurisdictions. Pair it with your own cookie banner or consent manager.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || null;

/** gtag.js loader URL, or null when analytics is not configured. */
export const GA_SCRIPT_SRC = GA_MEASUREMENT_ID
  ? `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  : null;

type Gtag = (...args: unknown[]) => void;

declare global {
  // Declaration merging is the only way to type third-party globals.
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

/**
 * Installs the `gtag` shim and starts a GA4 session on the configured
 * property. No-op when NEXT_PUBLIC_GA_MEASUREMENT_ID is unset.
 *
 * Call only once per page load: gtag.js drains `dataLayer` on load, so the
 * config command has to be queued before any event can be generated.
 */
export function installGtag(): void {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  const dataLayer = (window.dataLayer ??= []);
  window.gtag ??= (...args: unknown[]) => {
    dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    // Aggregate reporting only: no ads signals, no cross-site audiences.
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}
