/**
 * Consent-gated product analytics.
 *
 * The analytics vendor script itself is loaded by `components/site/analytics.tsx`
 * only after explicit consent. This module is the single place event names and
 * payloads are defined so pages never call vendor globals directly and a rename
 * is a compile error.
 *
 * It is vendor-neutral: it forwards to whichever of Plausible, GA4, or a plain
 * GTM `dataLayer` is present, and is a no-op when none is configured.
 */
import { readConsent } from './site';

export type AnalyticsEvent =
  | 'article_scroll'
  | 'cta_click'
  | 'install_copy'
  | 'github_click'
  | 'search_open'
  | 'search_select'
  | 'feedback'
  | 'feedback_reason'
  | 'copy_for_ai'
  | 'copy_jsx'
  | 'consent';

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

/**
 * Allowed prop keys per event. `track` is generic over this catalog, so a
 * misspelled or undocumented prop is a compile error rather than silent
 * analytics drift. Keep entries alphabetical-ish and scalar-valued only.
 */
export const EVENT_PROPS: Record<AnalyticsEvent, readonly string[]> = {
  article_scroll: ['depth', 'slug'],
  cta_click: ['cta', 'location'],
  install_copy: ['command', 'component', 'location', 'method'],
  github_click: ['location'],
  search_open: ['source'],
  search_select: ['href', 'queryLength'],
  feedback: ['helpful'],
  feedback_reason: ['path', 'reason'],
  copy_for_ai: ['component'],
  copy_jsx: ['component'],
  consent: ['choice', 'location'],
};

type EventProps<E extends AnalyticsEvent> = Partial<
  Record<(typeof EVENT_PROPS)[E][number], string | number | boolean | undefined>
>;

type Plausible = (event: string, options?: { props?: AnalyticsProps }) => void;
type Gtag = (
  command: 'js' | 'config' | 'set' | 'event',
  target: string | Date,
  props?: AnalyticsProps,
) => void;

declare global {
  // Declaration merging is the only way to type third-party globals.
  interface Window {
    plausible?: Plausible;
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

/**
 * GA4 measurement ID for the docs site.
 *
 * A measurement ID is a public identifier - it is served in the page HTML by
 * design, exactly like an analytics script URL - so it lives in code rather
 * than a build-time secret. `NEXT_PUBLIC_GA_MEASUREMENT_ID` can point a preview
 * or fork at a different property. Nothing loads until consent is granted.
 */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || 'G-QDQXNJV9MD';

/** gtag.js loader URL for {@link GA_MEASUREMENT_ID}. */
export const GA_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

/**
 * Installs the `gtag` shim and starts a GA4 session on the configured property.
 *
 * Call only after consent, and only once per page load: gtag.js drains
 * `dataLayer` on load, so the config command has to be queued before a visitor
 * can generate an event.
 */
export function installGtag(): void {
  if (typeof window === 'undefined') return;

  const dataLayer = (window.dataLayer ??= []);
  window.gtag ??= (...args: unknown[]) => {
    dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    // Aggregate reporting only: no ads signals, no cross-site audiences.
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

/**
 * Emits an event if the visitor has granted analytics consent.
 * Never throws and never blocks the interaction it is attached to.
 */
export function track<E extends AnalyticsEvent>(event: E, props: EventProps<E> = {}): void {
  if (typeof window === 'undefined' || readConsent() !== 'granted') return;

  const payload: AnalyticsProps = { ...props, page: window.location.pathname };

  try {
    if (window.plausible) {
      window.plausible(event, { props: payload });
      return;
    }
    if (window.gtag) {
      window.gtag('event', event, payload);
      return;
    }
    window.dataLayer?.push({ event, ...payload });
  } catch {
    // Analytics must never break the UI; a failed beacon is not actionable here.
  }
}
