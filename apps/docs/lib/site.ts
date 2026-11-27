/**
 * Single source of truth for site-level identity and contact details.
 *
 * IMPORTANT: fill `contact.email` with the real business details before
 * publishing legal pages — everything on the site reads from here.
 */
export const SITE = {
  name: 'Slipstream UI',
  url: 'https://slipstreamui.com',
  repo: 'https://github.com/michaelmcshinsky/slipstream-ui',
  tagline: 'The AI-first React component library',
  contact: {
    // TODO(owner): replace with the real support inbox.
    email: 'support@slipstreamui.com',
    hours: 'Replies within 2 business days',
  },
  social: {
    github: 'https://github.com/michaelmcshinsky',
  },
} as const;

export type PackageInfo = {
  /** npm package name, e.g. `@slipstream-ui/core`. */
  name: string;
  /** One-line role, shown in package lists and the installation table. */
  summary: string;
};

/**
 * Published npm packages, ordered by what a new consumer reaches for first.
 * URLs are derived from the name so a renamed package cannot leave a stale
 * hand-written link behind.
 */
export const PACKAGES: readonly PackageInfo[] = [
  { name: '@slipstream-ui/core', summary: 'Components, design tokens, and the cn() utility' },
  { name: '@slipstream-ui/ai', summary: 'AI chat and agent components' },
  { name: '@slipstream-ui/themes', summary: 'createTheme(), presets, and the CSS-variable contract' },
  { name: '@slipstream-ui/cli', summary: 'init, add, list, and diff for copying component source' },
  { name: '@slipstream-ui/registry', summary: 'Manifest registry resolution shared by the CLI and MCP server' },
  { name: '@slipstream-ui/mcp-server', summary: 'MCP tools for agent-driven component lookup and validation' },
  { name: '@slipstream-ui/i18n', summary: 'Locale provider, switcher, and message catalogs' },
];

export function npmPackageUrl(name: string): string {
  return `https://www.npmjs.com/package/${name}`;
}

/** MCP tools advertised by packages/mcp-server. Keep in sync with its tools/list. */
export const MCP_TOOLS = [
  'recommend_components',
  'list_components',
  'search_components',
  'get_component_manifest',
  'get_usage_examples',
  'validate_usage',
] as const;

export const MCP_TOOL_COUNT = MCP_TOOLS.length;

export const CONSENT_STORAGE_KEY = 'slipstream-consent';export const CONSENT_EVENT = 'slipstream-consent-change';

/**
 * Consent choices expire so returning visitors periodically re-confirm.
 * 180 days matches common EU consent-refresh guidance; adjust if the privacy
 * policy states a different period.
 */
export const CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

/**
 * Consent purposes (Consent Mode v2 granularity). Today the only toggleable
 * purpose is analytics; advertising signals are always denied and never
 * offered. Adding a purpose means extending this tuple, the stored shape,
 * and the PrivacyPreferences toggles.
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
        const preferences = toPreferences(p, v);
        if (preferences) return preferences;
      }
    }
  } catch {
    /* not JSON -- see legacy handling below */
  }
  // Legacy shape: a bare 'granted'/'denied' string with no timestamp. Age is
  // unknowable, so treat it as expired and let the banner re-prompt once.
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
    /* storage blocked — consent simply isn't persisted */
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
    /* storage blocked — nothing to clear */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}
