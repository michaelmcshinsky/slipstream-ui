// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import {
  CONSENT_MAX_AGE_MS,
  CONSENT_STORAGE_KEY,
  GA_MEASUREMENT_ID,
  consentForAll,
  installGtag,
  readConsent,
  sanitizeAnalyticsLocation,
  writeConsent,
} from './analytics';

describe('consent record', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns null when nothing is stored', () => {
    expect(readConsent()).toBeNull();
  });

  it('round-trips granted and denied choices as per-purpose preferences', () => {
    writeConsent(consentForAll(true));
    expect(readConsent()).toEqual({ analytics: true });
    writeConsent(consentForAll(false));
    expect(readConsent()).toEqual({ analytics: false });
  });

  it('migrates the legacy { v } shape into per-purpose preferences', () => {
    const now = Date.now();
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ v: 'granted', at: now - 1000 }),
    );
    expect(readConsent()).toEqual({ analytics: true });
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ v: 'denied', at: now - 1000 }),
    );
    expect(readConsent()).toEqual({ analytics: false });
  });

  it('expires choices older than the max age', () => {
    const stale = { p: { analytics: true }, at: Date.now() - CONSENT_MAX_AGE_MS - 1 };
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(stale));
    expect(readConsent()).toBeNull();
  });

  it('rejects malformed and legacy bare-string values', () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, 'not-json');
    expect(readConsent()).toBeNull();
    window.localStorage.setItem(CONSENT_STORAGE_KEY, 'granted');
    expect(readConsent()).toBeNull();
  });

  it('rejects unknown consent values', () => {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ v: 'maybe', at: Date.now() }),
    );
    expect(readConsent()).toBeNull();
  });
});

describe('sanitizeAnalyticsLocation', () => {
  it('strips query strings and fragments so tokens never reach GA4', () => {
    expect(
      sanitizeAnalyticsLocation('https://app.slipstreamui.com/reset-password?token=secret#frag'),
    ).toBe('https://app.slipstreamui.com/reset-password');
    expect(sanitizeAnalyticsLocation('https://app.slipstreamui.com/verify-email?token=abc&next=/x')).toBe(
      'https://app.slipstreamui.com/verify-email',
    );
  });

  it('keeps the origin and pathname for normal pages', () => {
    expect(sanitizeAnalyticsLocation('https://app.slipstreamui.com/dashboard/settings?tab=newsletter')).toBe(
      'https://app.slipstreamui.com/dashboard/settings',
    );
  });
});

describe('GA4 configuration', () => {
  it('has no fallback property - the docs site owns the shared GA4 ID', () => {
    // Dashboard traffic must not land in the docs funnel; the app only
    // reports when NEXT_PUBLIC_GA_MEASUREMENT_ID is set explicitly.
    expect(GA_MEASUREMENT_ID).toBe('');
  });
});

describe('installGtag', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
    delete window.gtag;
    delete window.dataLayer;
  });

  it('installs the gtag shim and queues consent defaults, update, js + config', () => {
    installGtag(consentForAll(true));

    expect(typeof window.gtag).toBe('function');
    const layer = window.dataLayer as unknown[][];
    expect(layer).toHaveLength(4);
    expect(layer[0]).toEqual([
      'consent',
      'default',
      expect.objectContaining({
        analytics_storage: 'denied',
        ad_storage: 'denied',
        security_storage: 'granted',
      }),
    ]);
    expect(layer[1]).toEqual([
      'consent',
      'update',
      expect.objectContaining({ analytics_storage: 'granted', ad_storage: 'denied' }),
    ]);
    expect(layer[2]?.[0]).toBe('js');
    expect(layer[3]).toEqual([
      'config',
      GA_MEASUREMENT_ID,
      expect.objectContaining({
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      }),
    ]);
  });

  it('is idempotent - a second call does not reinstall the shim', () => {
    installGtag();
    const shim = window.gtag;
    installGtag();
    expect(window.gtag).toBe(shim);
  });

  it('reports a sanitized page_location without query secrets', () => {
    window.history.pushState({}, '', '/reset-password?token=secret-value');
    installGtag();

    const config = (window.dataLayer as unknown[][]).find(
      (entry) => Array.isArray(entry) && entry[0] === 'config',
    );
    expect(config?.[2]).toEqual(
      expect.objectContaining({
        page_location: `${window.location.origin}/reset-password`,
      }),
    );
  });
});
