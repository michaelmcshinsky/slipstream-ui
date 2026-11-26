import { beforeEach, describe, expect, it, vi } from 'vitest';
import { consentForAll, writeConsent } from './site';
import { installGtag, track, updateConsentMode } from './analytics';

describe('analytics consent gate', () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete window.gtag;
    delete window.plausible;
    delete window.dataLayer;
  });

  it('does nothing until consent is granted', () => {
    const gtag = vi.fn();
    window.gtag = gtag as never;
    track('cta_click', { cta: 'get_started' });
    expect(gtag).not.toHaveBeenCalled();
  });

  it('does nothing when analytics consent is off', () => {
    writeConsent(consentForAll(false));
    const gtag = vi.fn();
    window.gtag = gtag as never;
    track('install_copy', { command: 'init' });
    expect(gtag).not.toHaveBeenCalled();
  });

  it('forwards the event and page to gtag when analytics consent is on', () => {
    writeConsent(consentForAll(true));
    const gtag = vi.fn();
    window.gtag = gtag as never;

    track('install_copy', { command: 'init', location: 'hero' });

    expect(gtag).toHaveBeenCalledWith(
      'event',
      'install_copy',
      expect.objectContaining({ command: 'init', location: 'hero', page: window.location.pathname })
    );
  });

  it('prefers Plausible when its global is present', () => {
    writeConsent(consentForAll(true));
    const plausible = vi.fn();
    const gtag = vi.fn();
    window.plausible = plausible as never;
    window.gtag = gtag as never;

    track('search_select', { href: '/docs/components/button' });

    expect(plausible).toHaveBeenCalledWith(
      'search_select',
      expect.objectContaining({ props: expect.objectContaining({ href: '/docs/components/button' }) })
    );
    expect(gtag).not.toHaveBeenCalled();
  });

  it('never throws when a vendor call fails', () => {
    writeConsent(consentForAll(true));
    window.gtag = (() => {
      throw new Error('blocked');
    }) as never;
    expect(() => track('feedback', { helpful: 'yes' })).not.toThrow();
  });
});

describe('Consent Mode v2', () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete window.gtag;
    delete window.dataLayer;
  });

  it('queues deny-by-default consent signals before js and config', () => {
    installGtag(consentForAll(true));

    const layer = window.dataLayer as unknown[][];
    expect(layer[0]).toEqual([
      'consent',
      'default',
      expect.objectContaining({
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        security_storage: 'granted',
      }),
    ]);
    expect(layer[1]).toEqual([
      'consent',
      'update',
      expect.objectContaining({ analytics_storage: 'granted', ad_storage: 'denied' }),
    ]);
    expect(layer[2]?.[0]).toBe('js');
    expect(layer[3]?.[0]).toBe('config');
  });

  it('keeps analytics_storage denied in the update when consent is off', () => {
    installGtag(consentForAll(false));

    const update = (window.dataLayer as unknown[][]).find(
      (entry) => Array.isArray(entry) && entry[0] === 'consent' && entry[1] === 'update',
    );
    expect(update?.[2]).toEqual(expect.objectContaining({ analytics_storage: 'denied' }));
  });

  it('updateConsentMode pushes an update through the shim without throwing', () => {
    installGtag(consentForAll(true));
    const before = (window.dataLayer as unknown[][]).length;
    updateConsentMode(consentForAll(false));
    const layer = window.dataLayer as unknown[][];
    expect(layer.length).toBe(before + 1);
    expect(layer.at(-1)).toEqual([
      'consent',
      'update',
      expect.objectContaining({ analytics_storage: 'denied' }),
    ]);
    // No shim at all: still a no-op, never throws.
    delete window.gtag;
    expect(() => updateConsentMode(null)).not.toThrow();
  });
});
