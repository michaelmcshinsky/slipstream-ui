// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import {
  CONSENT_MAX_AGE_MS,
  CONSENT_STORAGE_KEY,
  GA_MEASUREMENT_ID,
  GA_SCRIPT_SRC,
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

  it('round-trips a granted choice', () => {
    writeConsent('granted');
    expect(readConsent()).toBe('granted');
  });

  it('round-trips a denied choice', () => {
    writeConsent('denied');
    expect(readConsent()).toBe('denied');
  });

  it('expires choices older than the max age', () => {
    const stale = { v: 'granted', at: Date.now() - CONSENT_MAX_AGE_MS - 1 };
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
  it('defaults to the shared Slipstream measurement ID', () => {
    expect(GA_MEASUREMENT_ID).toBe('G-QDQXNJV9MD');
    expect(GA_SCRIPT_SRC).toBe('https://www.googletagmanager.com/gtag/js?id=G-QDQXNJV9MD');
  });
});

describe('installGtag', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
    delete window.gtag;
    delete window.dataLayer;
  });

  it('installs the gtag shim and queues js + config before the script loads', () => {
    installGtag();

    expect(typeof window.gtag).toBe('function');
    const layer = window.dataLayer as unknown[][];
    expect(layer).toHaveLength(2);
    expect(layer[0]?.[0]).toBe('js');
    expect(layer[1]).toEqual([
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
