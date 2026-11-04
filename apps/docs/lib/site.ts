/**
 * Single source of truth for site-level identity and contact details.
 *
 * IMPORTANT: fill `contact.email` and `contact.address` with the real
 * business details before publishing legal pages — everything on the site
 * reads from here.
 */
export const SITE = {
  name: 'Slipstream UI',
  url: 'https://slipstreamui.com',
  repo: 'https://github.com/michaelmcshinsky/slipstream-ui',
  tagline: 'The AI-first React component library',
  contact: {
    // TODO(owner): replace with the real support inbox.
    email: 'support@slipstreamui.com',
    // TODO(owner): replace with the real postal address (required for the
    // privacy/terms pages and any EU-facing contact obligations).
    address: ['Slipstream UI', 'Postal address to be confirmed', 'United States'],
    hours: 'Replies within 2 business days',
  },
  social: {
    github: 'https://github.com/michaelmcshinsky',
  },
} as const;

export const CONSENT_STORAGE_KEY = 'slipstream-consent';
export const CONSENT_EVENT = 'slipstream-consent-change';

export type ConsentValue = 'granted' | 'denied';

export function readConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: ConsentValue): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    /* storage blocked — consent simply isn't persisted */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}
