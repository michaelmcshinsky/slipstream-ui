import { afterEach, describe, expect, it, vi } from 'vitest';

describe('google-analytics', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    delete window.gtag;
    delete window.dataLayer;
  });

  it('is inactive when NEXT_PUBLIC_GA_MEASUREMENT_ID is unset', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '');
    vi.resetModules();
    const mod = await import('./google-analytics');

    expect(mod.GA_MEASUREMENT_ID).toBeNull();
    expect(mod.GA_SCRIPT_SRC).toBeNull();

    mod.installGtag();
    expect(window.dataLayer).toBeUndefined();
    expect(window.gtag).toBeUndefined();
  });

  it('treats a blank measurement ID as unconfigured', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '   ');
    vi.resetModules();
    const mod = await import('./google-analytics');

    expect(mod.GA_MEASUREMENT_ID).toBeNull();
    expect(mod.GA_SCRIPT_SRC).toBeNull();
  });

  it('builds the gtag.js URL from the configured ID', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    vi.resetModules();
    const mod = await import('./google-analytics');

    expect(mod.GA_MEASUREMENT_ID).toBe('G-TEST123');
    expect(mod.GA_SCRIPT_SRC).toBe(
      'https://www.googletagmanager.com/gtag/js?id=G-TEST123',
    );
  });

  it('queues js + config with privacy-safe flags once configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    vi.resetModules();
    const mod = await import('./google-analytics');

    mod.installGtag();

    expect(typeof window.gtag).toBe('function');
    expect(window.dataLayer).toEqual([
      ['js', expect.any(Date)],
      [
        'config',
        'G-TEST123',
        expect.objectContaining({
          allow_google_signals: false,
          allow_ad_personalization_signals: false,
        }),
      ],
    ]);
  });
});
