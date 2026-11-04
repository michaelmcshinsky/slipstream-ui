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
  | 'cta_click'
  | 'install_copy'
  | 'github_click'
  | 'search_open'
  | 'search_select'
  | 'feedback';

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

type Plausible = (event: string, options?: { props?: AnalyticsProps }) => void;
type Gtag = (command: 'event', event: string, props?: AnalyticsProps) => void;

declare global {
  // Declaration merging is the only way to type third-party globals.
  interface Window {
    plausible?: Plausible;
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

/**
 * Emits an event if the visitor has granted analytics consent.
 * Never throws and never blocks the interaction it is attached to.
 */
export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
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
