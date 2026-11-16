import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_EVENT, clearConsent, readConsent, writeConsent } from './site';

describe('consent storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns null before a choice is made', () => {
    expect(readConsent()).toBeNull();
  });

  it('persists and reads a granted choice', () => {
    writeConsent('granted');
    expect(window.localStorage.getItem('slipstream-consent')).toBe('granted');
    expect(readConsent()).toBe('granted');
  });

  it('persists and reads a denied choice', () => {
    writeConsent('denied');
    expect(readConsent()).toBe('denied');
  });

  it('ignores unknown stored values', () => {
    window.localStorage.setItem('slipstream-consent', 'maybe');
    expect(readConsent()).toBeNull();
  });

  it('announces changes so the banner and analytics stay in sync', () => {
    const listener = vi.fn();
    window.addEventListener(CONSENT_EVENT, listener);
    writeConsent('granted');
    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toBe('granted');
    window.removeEventListener(CONSENT_EVENT, listener);
  });

  it('clears the choice and announces a reset', () => {
    writeConsent('granted');
    const listener = vi.fn();
    window.addEventListener(CONSENT_EVENT, listener);

    clearConsent();

    expect(window.localStorage.getItem('slipstream-consent')).toBeNull();
    expect(readConsent()).toBeNull();
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toBeNull();
    window.removeEventListener(CONSENT_EVENT, listener);
  });
});
