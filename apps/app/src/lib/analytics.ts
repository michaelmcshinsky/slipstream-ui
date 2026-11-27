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

/**
 * Consent purposes (Consent Mode v2 granularity). Today the only toggleable
 * purpose is analytics; advertising signals are always denied and never
 * offered. Adding a purpose means extending this tuple and the stored shape.
 */
export const CONSENT_PURPOSES = ['analytics'] as const;
export type ConsentPurpose = (typeof CONSENT_PURPOSES)[number];
export type ConsentPreferences = Record<ConsentPurpose, boolean>;

/** Banner-level shorthand: accept/decline applies to every purpose. */
export type ConsentValue = 'granted' | 'denied';

type StoredConsent = { p?: unknown; v?: unknown; at: number };

function isPurposeMap(value: unknown): value is ConsentPreferences {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return CONSENT_PURPOSES.every((purpose) => typeof record[purpose] === 'boolean');
}

/** Normalize a stored `p`/`v` payload to preferences, or null if invalid. */
function toPreferences(p: unknown, v: unknown): ConsentPreferences | null {
  if (isPurposeMap(p)) return p;
  // Legacy shape: { v: 'granted' | 'denied' } predates per-purpose storage.
  // Migrate it so returning visitors keep their choice.
  if (v === 'granted' || v === 'denied') {
    return { analytics: v === 'granted' };
  }
  return null;
}

function parseStoredConsent(raw: string | null): ConsentPreferences | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) {
      const { p, v, at } = parsed as Partial<StoredConsent>;
      if (
        typeof at === 'number' &&
        Number.isFinite(at) &&
        Date.now() - at < CONSENT_MAX_AGE_MS
      ) {
        return toPreferences(p, v);
      }
    }
  } catch {
    /* not JSON -- no valid stored choice */
  }
  return null;
}

/** Current per-purpose consent, or null when the visitor has not decided. */
export function readConsent(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    return parseStoredConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}

/** All purposes set to the same value — the banner's accept/decline action. */
export function consentForAll(allowed: boolean): ConsentPreferences {
  return { analytics: allowed };
}

export function writeConsent(preferences: ConsentPreferences): void {
  if (typeof window === 'undefined') return;
  const stored: StoredConsent = { p: preferences, at: Date.now() };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    /* storage blocked - consent simply isn't persisted */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: preferences }));
}

/** Remove the stored choice so the banner returns and analytics stops loading. */
export function clearConsent(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    // GA4 sets _ga and _ga_<container>. Expire both so "reset" is not a
    // promise the browser cannot keep.
    for (const entry of document.cookie.split(';')) {
      const name = entry.split('=')[0]?.trim();
      if (name && (name === '_ga' || name.startsWith('_ga_'))) {
        document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      }
    }
  } catch {
    /* storage blocked - nothing to clear */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
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
/**
 * Google Consent Mode v2 defaults. Everything starts denied except the
 * strictly-necessary storage signals; the loader then sends an `update`
 * reflecting the visitor's stored preferences before `config`, so gtag.js
 * sees a complete consent state on first execution. Advertising signals
 * stay denied permanently - the app runs no ads.
 */
const CONSENT_MODE_DEFAULTS = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'granted',
  personalization_storage: 'denied',
  security_storage: 'granted',
} as const;

function consentModeUpdate(preferences: ConsentPreferences | null): Record<string, string> {
  return {
    analytics_storage: preferences?.analytics ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  };
}

/**
 * Push a Consent Mode v2 state change. Safe to call whether or not the gtag
 * shim exists yet - the shim queues onto dataLayer, and a missing shim means
 * analytics was never loaded so there is nothing to update.
 */
export function updateConsentMode(preferences: ConsentPreferences | null): void {
  if (typeof window === 'undefined') return;
  window.gtag?.('consent', 'update', consentModeUpdate(preferences));
}

export function installGtag(preferences: ConsentPreferences | null = null): void {
  if (typeof window === 'undefined') return;

  const dataLayer = (window.dataLayer ??= []);
  window.gtag ??= (...args: unknown[]) => {
    dataLayer.push(args);
  };

  // Deny-by-default first, then the visitor's actual choices - both queued
  // before js/config so the state is settled before gtag.js drains the queue.
  window.gtag('consent', 'default', CONSENT_MODE_DEFAULTS);
  window.gtag('consent', 'update', consentModeUpdate(preferences));
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_location: sanitizeAnalyticsLocation(window.location.href),
    // Aggregate reporting only: no ads signals, no cross-site audiences.
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

/**
 * Funnel events for the dashboard. `license_activated` is declared for
 * completeness but has no client-side moment today - license activation
 * happens through the CLI/MCP API, so wiring it needs server-side
 * Measurement Protocol (api_secret) rather than gtag.
 */
export type AppAnalyticsEvent =
  | 'signup'
  | 'email_verified'
  | 'checkout_started'
  | 'payment_succeeded'
  | 'license_activated'
  | 'newsletter_subscribed'
  | 'experiment_exposure';

export type AppAnalyticsProps = Record<string, string | number | boolean | undefined>;

/**
 * Emits a funnel event when analytics is enabled and consent was granted.
 * Never throws; a missing gtag shim (consent not yet acted on) is a no-op.
 */
export function track(event: AppAnalyticsEvent, props: AppAnalyticsProps = {}): void {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID || readConsent()?.analytics !== true) return;
  window.gtag?.('event', event, {
    ...props,
    page_location: sanitizeAnalyticsLocation(window.location.href),
  });
}
