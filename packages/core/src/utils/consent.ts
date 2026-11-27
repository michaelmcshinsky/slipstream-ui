import * as React from 'react';

/**
 * Per-purpose consent choices, e.g. `{ analytics: true, marketing: false }`.
 * Consumers define their own purpose keys via `useConsent({ purposes })`.
 */
export type ConsentPreferences = Record<string, boolean>;

export type UseConsentOptions = {
  /** localStorage key for the stored decision. Default 'slipstream-consent'. */
  storageKey?: string;
  /** Consent purposes persisted as booleans. Default ['analytics']. */
  purposes?: readonly string[];
  /**
   * How long a stored decision stays valid before the visitor is asked
   * again. Default 180 days (common EU consent-refresh guidance).
   */
  maxAgeMs?: number;
};

export type Consent = {
  /** Current per-purpose preferences, or null when undecided or expired. */
  preferences: ConsentPreferences | null;
  /** True once the visitor has a valid stored decision. */
  decided: boolean;
  /** Set every purpose to the same value — the banner's accept/decline. */
  setAll(allowed: boolean): void;
  /** Store an explicit preference map (e.g. from a preferences dialog). */
  set(preferences: ConsentPreferences): void;
  /** Forget the stored choice so the banner returns and gated code stops. */
  clear(): void;
};

const DEFAULT_STORAGE_KEY = 'slipstream-consent';
const DEFAULT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;
const DEFAULT_PURPOSES = ['analytics'] as const;

/** Window event fired whenever a consent decision is written or cleared. */
export const CONSENT_CHANGE_EVENT = 'slipstream:consent-change';

type ConsentChangeDetail = { storageKey: string; preferences: ConsentPreferences | null };

type StoredConsent = { p?: unknown; at?: unknown };

function isPurposeMap(value: unknown, purposes: readonly string[]): value is ConsentPreferences {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return purposes.every((purpose) => typeof record[purpose] === 'boolean');
}

function readStored(
  storageKey: string,
  purposes: readonly string[],
  maxAgeMs: number
): ConsentPreferences | null {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const { p, at } = parsed as StoredConsent;
    if (typeof at !== 'number' || !Number.isFinite(at)) return null;
    if (Date.now() - at >= maxAgeMs) return null;
    if (!isPurposeMap(p, purposes)) return null;
    const preferences: ConsentPreferences = {};
    for (const purpose of purposes) preferences[purpose] = p[purpose];
    return preferences;
  } catch {
    return null;
  }
}

function writeStored(storageKey: string, preferences: ConsentPreferences): void {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify({ p: preferences, at: Date.now() }));
  } catch {
    /* storage blocked — consent simply isn't persisted */
  }
  window.dispatchEvent(
    new CustomEvent<ConsentChangeDetail>(CONSENT_CHANGE_EVENT, {
      detail: { storageKey, preferences },
    })
  );
}

function clearStored(storageKey: string): void {
  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    /* storage blocked — nothing to clear */
  }
  window.dispatchEvent(
    new CustomEvent<ConsentChangeDetail>(CONSENT_CHANGE_EVENT, {
      detail: { storageKey, preferences: null },
    })
  );
}

/**
 * Headless consent state: reads a per-purpose decision from localStorage,
 * persists accept/decline/customize choices, expires stale decisions, and
 * keeps every `useConsent` instance on the page in sync through a window
 * event (plus the native `storage` event for other tabs).
 *
 * The first client render reports `decided: false` so SSR markup matches;
 * the stored value is read in an effect after mount. To avoid a banner
 * flash for returning visitors, gate first paint with a theme-script class
 * the way cookie-banner implementations typically do.
 */
export function useConsent({
  storageKey = DEFAULT_STORAGE_KEY,
  purposes = DEFAULT_PURPOSES,
  maxAgeMs = DEFAULT_MAX_AGE_MS,
}: UseConsentOptions = {}): Consent {
  const [preferences, setPreferences] = React.useState<ConsentPreferences | null>(null);
  // Callbacks stay referentially stable while always seeing the latest
  // purposes array, which consumers often pass inline.
  const purposesRef = React.useRef(purposes);
  purposesRef.current = purposes;
  const purposesKey = purposes.join('');

  React.useEffect(() => {
    const active = purposesRef.current;
    const sync = () => setPreferences(readStored(storageKey, active, maxAgeMs));
    sync();
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<ConsentChangeDetail>).detail;
      if (detail?.storageKey === storageKey) {
        setPreferences(detail.preferences);
      }
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) sync();
    };
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
      window.removeEventListener('storage', onStorage);
    };
  }, [storageKey, maxAgeMs, purposesKey]);

  const setAll = React.useCallback(
    (allowed: boolean) => {
      const next: ConsentPreferences = {};
      for (const purpose of purposesRef.current) next[purpose] = allowed;
      writeStored(storageKey, next);
      setPreferences(next);
    },
    [storageKey]
  );

  const set = React.useCallback(
    (next: ConsentPreferences) => {
      const merged: ConsentPreferences = {};
      for (const purpose of purposesRef.current) merged[purpose] = next[purpose] === true;
      writeStored(storageKey, merged);
      setPreferences(merged);
    },
    [storageKey]
  );

  const clear = React.useCallback(() => {
    clearStored(storageKey);
    setPreferences(null);
  }, [storageKey]);

  return { preferences, decided: preferences !== null, setAll, set, clear };
}
