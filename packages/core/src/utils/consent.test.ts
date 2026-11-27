import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useConsent } from './consent';

const KEY = 'test-consent';

function seed(raw: string) {
  window.localStorage.setItem(KEY, raw);
}

describe('useConsent', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts undecided with empty storage', () => {
    const { result } = renderHook(() => useConsent({ storageKey: KEY }));
    expect(result.current.decided).toBe(false);
    expect(result.current.preferences).toBeNull();
  });

  it('setAll grants every purpose and persists the decision', () => {
    const { result } = renderHook(() =>
      useConsent({ storageKey: KEY, purposes: ['analytics', 'marketing'] })
    );
    act(() => result.current.setAll(true));
    expect(result.current.decided).toBe(true);
    expect(result.current.preferences).toEqual({ analytics: true, marketing: true });
    const stored = JSON.parse(window.localStorage.getItem(KEY)!);
    expect(stored.p).toEqual({ analytics: true, marketing: true });
    expect(typeof stored.at).toBe('number');
  });

  it('setAll(false) denies every purpose', () => {
    const { result } = renderHook(() => useConsent({ storageKey: KEY }));
    act(() => result.current.setAll(false));
    expect(result.current.preferences).toEqual({ analytics: false });
  });

  it('reads a persisted decision on mount', () => {
    seed(JSON.stringify({ p: { analytics: true }, at: Date.now() }));
    const { result } = renderHook(() => useConsent({ storageKey: KEY }));
    expect(result.current.decided).toBe(true);
    expect(result.current.preferences).toEqual({ analytics: true });
  });

  it('treats expired decisions as undecided', () => {
    const stale = { p: { analytics: true }, at: Date.now() - 200 * 24 * 60 * 60 * 1000 };
    seed(JSON.stringify(stale));
    const { result } = renderHook(() => useConsent({ storageKey: KEY }));
    expect(result.current.decided).toBe(false);
  });

  it('honors a custom maxAgeMs', () => {
    const entry = { p: { analytics: true }, at: Date.now() - 60_000 };
    seed(JSON.stringify(entry));
    const { result } = renderHook(() =>
      useConsent({ storageKey: KEY, maxAgeMs: 30_000 })
    );
    expect(result.current.decided).toBe(false);
  });

  it('treats malformed payloads as undecided', () => {
    seed('not json');
    const { result } = renderHook(() => useConsent({ storageKey: KEY }));
    expect(result.current.decided).toBe(false);
    seed(JSON.stringify({ p: { analytics: 'yes' }, at: Date.now() }));
    const { result: second } = renderHook(() => useConsent({ storageKey: KEY }));
    expect(second.current.decided).toBe(false);
  });

  it('set() stores an explicit per-purpose map', () => {
    const { result } = renderHook(() =>
      useConsent({ storageKey: KEY, purposes: ['analytics', 'marketing'] })
    );
    act(() => result.current.set({ analytics: true, marketing: false }));
    expect(result.current.preferences).toEqual({ analytics: true, marketing: false });
    // Missing purposes default to denied rather than leaking through.
    act(() => result.current.set({ analytics: true }));
    expect(result.current.preferences).toEqual({ analytics: true, marketing: false });
  });

  it('clear() forgets the decision and removes storage', () => {
    const { result } = renderHook(() => useConsent({ storageKey: KEY }));
    act(() => result.current.setAll(true));
    act(() => result.current.clear());
    expect(result.current.decided).toBe(false);
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });

  it('keeps separate hook instances in sync via the change event', () => {
    const banner = renderHook(() => useConsent({ storageKey: KEY }));
    const gate = renderHook(() => useConsent({ storageKey: KEY }));
    act(() => banner.result.current.setAll(true));
    expect(gate.result.current.decided).toBe(true);
    expect(gate.result.current.preferences).toEqual({ analytics: true });
    act(() => gate.result.current.clear());
    expect(banner.result.current.decided).toBe(false);
  });

  it('ignores change events for other storage keys', () => {
    const { result } = renderHook(() => useConsent({ storageKey: KEY }));
    act(() => {
      window.dispatchEvent(
        new CustomEvent('slipstream:consent-change', {
          detail: { storageKey: 'other-key', preferences: { analytics: true } },
        })
      );
    });
    expect(result.current.decided).toBe(false);
  });
});
