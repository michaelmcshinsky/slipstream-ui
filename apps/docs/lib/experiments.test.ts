// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getVariant, getVisitorId, trackExperimentExposure } from './experiments';
import { consentForAll, writeConsent } from './site';

const VARIANTS = ['control', 'variant-b'] as const;

describe('experiment assignment', () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete window.gtag;
    delete window.dataLayer;
  });

  it('assigns deterministically for the same visitor and experiment', () => {
    const first = getVariant('hero-cta', VARIANTS);
    expect(getVariant('hero-cta', VARIANTS)).toBe(first);
  });

  it('uses a stable persisted visitor id', () => {
    const id = getVisitorId();
    expect(getVisitorId()).toBe(id);
    expect(window.localStorage.getItem('slipstream-visitor-id')).toBe(id);
  });

  it('can assign different variants across experiments', () => {
    // Not a guarantee for every pair, but across several experiments at
    // least two distinct assignments must occur for a fixed visitor.
    const seen = new Set(
      ['exp-a', 'exp-b', 'exp-c', 'exp-d', 'exp-e'].map((e) =>
        getVariant(e, VARIANTS),
      ),
    );
    expect(seen.size).toBeGreaterThan(1);
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

  it('emits experiment_exposure through gtag when analytics consent is on', () => {
    writeConsent(consentForAll(true));
    const gtag = vi.fn();
    window.gtag = gtag as never;

    trackExperimentExposure('hero-cta', 'variant-b');

    expect(gtag).toHaveBeenCalledWith(
      'event',
      'experiment_exposure',
      expect.objectContaining({ experiment: 'hero-cta', variant: 'variant-b' }),
    );
  });

  it('stays silent without analytics consent', () => {
    const gtag = vi.fn();
    window.gtag = gtag as never;

    trackExperimentExposure('hero-cta', 'variant-b');

    expect(gtag).not.toHaveBeenCalled();
  });
});
