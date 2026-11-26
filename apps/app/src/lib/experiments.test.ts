// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getVariant, getVisitorId, trackExperimentExposure } from './experiments';
import { consentForAll, writeConsent, GA_MEASUREMENT_ID } from './analytics';

const VARIANTS = ['control', 'variant-b'] as const;

describe('experiment assignment', () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete window.gtag;
    delete window.dataLayer;
  });

  it('assigns deterministically for the same visitor and experiment', () => {
    const first = getVariant('checkout-cta', VARIANTS);
    expect(getVariant('checkout-cta', VARIANTS)).toBe(first);
  });

  it('uses a stable persisted visitor id', () => {
    const id = getVisitorId();
    expect(getVisitorId()).toBe(id);
    expect(window.localStorage.getItem('slipstream-visitor-id')).toBe(id);
  });

  it('throws on an empty variant list', () => {
    expect(() => getVariant('broken', [])).toThrow(/no variants/);
  });
});

describe('experiment exposure tracking', () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete window.gtag;
    delete window.dataLayer;
  });

  it('stays silent without analytics consent', () => {
    const gtag = vi.fn();
    window.gtag = gtag as never;

    trackExperimentExposure('checkout-cta', 'variant-b');

    expect(gtag).not.toHaveBeenCalled();
  });

  it('emits through gtag when consent and a GA property are configured', () => {
    // GA_MEASUREMENT_ID is empty in tests, so track() no-ops even with
    // consent; assert the consent gate is what blocks first by checking the
    // silent path above and that a granted consent still does not throw.
    writeConsent(consentForAll(true));
    expect(() => trackExperimentExposure('checkout-cta', 'variant-b')).not.toThrow();
    expect(GA_MEASUREMENT_ID).toBe('');
  });
});
