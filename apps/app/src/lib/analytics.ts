/**
 * Consent-gated analytics for the dashboard app.
 *
 * Google Analytics 4 loads only after the visitor accepts cookies
 * (components/cookie-banner.tsx + components/analytics.tsx); nothing is
 * injected beforehand. This module owns the consent record and the gtag
 * bootstrap so pages never call vendor globals directly.
 *
 * The measurement ID is a public identifier - it is served in the page HTML by
 * design, exactly like an analytics script URL - so it lives in code rather
 * than a build-time secret. NEXT_PUBLIC_GA_MEASUREMENT_ID can point a preview
 * or fork at a different property.
 */

export const CONSENT_STORAGE_KEY = 'slipstream-consent';
export const CONSENT_EVENT = 'slipstream-consent-change';

/**
 * Consent choices expire so returning visitors periodically re-confirm.
 * 180 days matches common EU consent-refresh guidance; adjust if the privacy
 * policy states a different period.
 */
export const CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

export type ConsentValue = 'granted' | 'denied';

type StoredConsent = { v: ConsentValue; at: number };

function isConsentValue(value: unknown): value is ConsentValue {
  return value === 'granted' || value === 'denied';
}

function parseStoredConsent(raw: string | null): ConsentValue | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) {
      const { v, at } = parsed as Partial<StoredConsent>;
      if (
        isConsentValue(v) &&
        typeof at === 'number' &&
        Number.isFinite(at) &&
        Date.now() - at < CONSENT_MAX_AGE_MS
      ) {
        return v;
      }
    }
  } catch {
    /* not JSON -- no valid stored choice */
  }
  return null;
}

export function readConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null;
  try {
    return parseStoredConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function writeConsent(value: ConsentValue): void {
  if (typeof window === 'undefined') return;
  const stored: StoredConsent = { v: value, at: Date.now() };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    /* storage blocked - consent simply isn't persisted */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

/**
 * GA4 measurement ID for the dashboard. Deliberately has NO fallback: the
 * docs site owns the shared property, and dashboard traffic (login, verify,
 * reset, authenticated pages) must not contaminate its funnel metrics.
 * Set NEXT_PUBLIC_GA_MEASUREMENT_ID to a dedicated app property to enable.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? '';

/**
 * GA4 collects `page_location` with the full query string. Auth and
 * newsletter pages put single-use secrets in the URL (`token`, `code`,
 * `state`), so the app reports origin + pathname only.
 */
export function sanitizeAnalyticsLocation(href: string): string {
  try {
    const url = new URL(href);
    return `${url.origin}${url.pathname}`;
  } catch {
    return href.split(/[?#]/)[0] ?? href;
  }
}

/** gtag.js loader URL for {@link GA_MEASUREMENT_ID}. */
export const GA_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

type Gtag = (...args: unknown[]) => void;

declare global {
  // Declaration merging is the only way to type third-party globals.
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

/**
 * Installs the `gtag` shim and starts a GA4 session on the configured property.
 *
 * Call only after consent, and only once per page load: gtag.js drains
 * `dataLayer` on load, so the config command has to be queued before a visitor
 * can generate an event.
 */
export function installGtag(): void {
  if (typeof window === 'undefined') return;

  const dataLayer = (window.dataLayer ??= []);
  window.gtag ??= (...args: unknown[]) => {
    dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_location: sanitizeAnalyticsLocation(window.location.href),
    // Aggregate reporting only: no ads signals, no cross-site audiences.
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}
