import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CONSENT_EVENT,
  CONSENT_MAX_AGE_MS,
  CONSENT_STORAGE_KEY,
  clearConsent,
  consentForAll,
  readConsent,
  writeConsent,
} from './site';

describe('consent storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null before a choice is made', () => {
    expect(readConsent()).toBeNull();
  });

  it('persists and reads per-purpose preferences', () => {
    writeConsent(consentForAll(true));
    const stored = JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY) ?? '{}') as {
      p?: unknown;
      at?: number;
    };
    expect(stored.p).toEqual({ analytics: true });
    expect(typeof stored.at).toBe('number');
    expect(readConsent()).toEqual({ analytics: true });
  });

  it('persists and reads a denied choice', () => {
    writeConsent(consentForAll(false));
    expect(readConsent()).toEqual({ analytics: false });
  });

  it('ignores unknown stored values', () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, 'maybe');
    expect(readConsent()).toBeNull();
  });

  it('treats legacy bare-string consent as expired and re-prompts', () => {
    // Pre-expiry releases stored 'granted'/'denied' with no timestamp; the
    // age is unknowable so the choice must not be honored indefinitely.
    window.localStorage.setItem(CONSENT_STORAGE_KEY, 'granted');
    expect(readConsent()).toBeNull();
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

  it('returns null once a stored choice is older than CONSENT_MAX_AGE_MS', () => {
    const now = Date.now();
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ p: { analytics: true }, at: now - CONSENT_MAX_AGE_MS - 1 }),
    );
    expect(readConsent()).toBeNull();
  });

  it('still honors a choice inside the freshness window', () => {
    const now = Date.now();
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ p: { analytics: false }, at: now - CONSENT_MAX_AGE_MS + 1000 }),
    );
    expect(readConsent()).toEqual({ analytics: false });
  });

  it('rejects malformed JSON and wrong-typed fields', () => {
    const fresh = Date.now();
    window.localStorage.setItem(CONSENT_STORAGE_KEY, '{"p":{"analytics":true}}');
    expect(readConsent()).toBeNull();
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ p: { analytics: 'yes' }, at: fresh }),
    );
    expect(readConsent()).toBeNull();
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ v: 'maybe', at: fresh }),
    );
    expect(readConsent()).toBeNull();
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ p: { analytics: true }, at: 'soon' }),
    );
    expect(readConsent()).toBeNull();
  });

  it('announces changes so the banner and analytics stay in sync', () => {
    const listener = vi.fn();
    window.addEventListener(CONSENT_EVENT, listener);
    writeConsent(consentForAll(true));
    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({ analytics: true });
    window.removeEventListener(CONSENT_EVENT, listener);
  });

  it('clears the choice and announces a reset', () => {
    writeConsent(consentForAll(true));
    const listener = vi.fn();
    window.addEventListener(CONSENT_EVENT, listener);

    clearConsent();

    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
    expect(readConsent()).toBeNull();
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toBeNull();
    window.removeEventListener(CONSENT_EVENT, listener);
  });
});
