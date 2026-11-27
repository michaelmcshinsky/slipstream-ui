/**
 * Experiment assignment hooks (IMP-DAT-015).
 *
 * Deterministic, dependency-free A/B assignment: a random first-party
 * visitor ID (localStorage, no PII) is hashed with the experiment name so a
 * visitor always sees the same variant across sessions. Assignment itself is
 * functional storage - it reveals nothing and is not sent anywhere. Exposure
 * measurement goes through `track('experiment_exposure')`, which is already
 * consent-gated, so non-consenting visitors get stable variants without
 * generating analytics events.
 *
 * Usage:
 *   const variant = getVariant('checkout-cta', ['control', 'variant-b']);
 *   // render `variant`, then once per mount:
 *   useEffect(() => trackExperimentExposure('checkout-cta', variant), [variant]);
 */
import { track } from './analytics';

const VISITOR_ID_KEY = 'slipstream-visitor-id';

/** Random first-party identifier, created lazily. Never leaves the browser. */
export function getVisitorId(): string {
  if (typeof window === 'undefined') return 'ssr';
  try {
    const existing = window.localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_ID_KEY, id);
    return id;
  } catch {
    // Storage blocked: fall back to a per-load id so assignment still works
    // for this page view without persisting anything.
    return `ephemeral-${Math.random().toString(36).slice(2)}`;
  }
}

/** FNV-1a 32-bit hash - stable across sessions and platforms. */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Assign a visitor to a variant of `experiment`. Deterministic: same
 * visitor + experiment always yields the same variant. Throws on an empty
 * variant list so a misconfigured experiment fails loudly at build/dev time.
 */
export function getVariant<T extends string>(experiment: string, variants: readonly T[]): T {
  if (variants.length === 0) throw new Error(`Experiment "${experiment}" has no variants`);
  return variants[hash(`${experiment}:${getVisitorId()}`) % variants.length];
}

/**
 * Record that a visitor was exposed to an experiment variant. Routed through
 * `track`, so it only reaches analytics after consent.
 */
export function trackExperimentExposure(experiment: string, variant: string): void {
  track('experiment_exposure', { experiment, variant });
}
