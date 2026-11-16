import { beforeEach, describe, expect, it, vi } from 'vitest';
import { writeConsent } from './site';
import { track } from './analytics';

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

  it('does nothing after consent is denied', () => {
    writeConsent('denied');
    const gtag = vi.fn();
    window.gtag = gtag as never;
    track('install_copy', { command: 'init' });
    expect(gtag).not.toHaveBeenCalled();
  });

  it('forwards the event and page to gtag when consent is granted', () => {
    writeConsent('granted');
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
    writeConsent('granted');
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
    writeConsent('granted');
    window.gtag = (() => {
      throw new Error('blocked');
    }) as never;
    expect(() => track('feedback', { helpful: 'yes' })).not.toThrow();
  });
});
