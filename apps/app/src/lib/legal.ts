/**
 * Legal document versioning for consent records.
 *
 * Bump LEGAL_VERSION whenever the published Terms of Service or Privacy
 * Policy materially changes; new signups then record which revision they
 * accepted. Existing users keep their original stamp.
 */
export const LEGAL_VERSION = '2026-11-24';

/** Canonical legal documents, hosted on the docs domain. */
export const LEGAL_URLS = {
  terms: 'https://slipstreamui.com/terms',
  privacy: 'https://slipstreamui.com/privacy',
} as const;
