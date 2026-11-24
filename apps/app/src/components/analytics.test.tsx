// @vitest-environment jsdom
import type { ReactElement } from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '@slipstream-ui/i18n/react';
import type { Locale } from '@slipstream-ui/i18n';
import { writeConsent } from '@/lib/analytics';
import { Analytics } from './analytics';
import { CookieBanner } from './cookie-banner';

function renderWithI18n(ui: ReactElement, locale: Locale = 'en') {
  return render(<I18nProvider locale={locale}>{ui}</I18nProvider>);
}

const analyticsScript = () =>
  document.querySelector('script[data-slipstream-analytics="true"]');

const GA_ID = 'G-TESTAPP1';

describe('Analytics loader', () => {
  afterEach(() => {
    cleanup();
    document
      .querySelectorAll('script[data-slipstream-analytics="true"]')
      .forEach((node) => node.remove());
    delete (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`];
    vi.unstubAllEnvs();
    vi.resetModules();
  });
  beforeEach(() => {
    window.localStorage.clear();
    delete window.gtag;
    delete window.dataLayer;
  });

  it('injects nothing until consent is granted', () => {
    renderWithI18n(<Analytics />);
    expect(analyticsScript()).toBeNull();
    expect(window.dataLayer).toBeUndefined();
  });

  it('stays disabled when no app GA4 property is configured', () => {
    // DAT-021: the dashboard must not report into the docs site's property.
    writeConsent('granted');
    renderWithI18n(<Analytics />);
    expect(analyticsScript()).toBeNull();
    expect(window.dataLayer).toBeUndefined();
  });
});

describe('Analytics loader with a configured GA4 property', () => {
  // GA_MEASUREMENT_ID is a module-level const, so the env stub must be in
  // place before the module graph is re-imported.
  async function renderConfigured() {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', GA_ID);
    const [{ Analytics: Configured }, { writeConsent: write }] = await Promise.all([
      import('./analytics'),
      import('@/lib/analytics'),
    ]);
    return { Configured, write };
  }

  afterEach(() => {
    cleanup();
    document
      .querySelectorAll('script[data-slipstream-analytics="true"]')
      .forEach((node) => node.remove());
    delete (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`];
    vi.unstubAllEnvs();
    vi.resetModules();
  });
  beforeEach(() => {
    window.localStorage.clear();
    delete window.gtag;
    delete window.dataLayer;
  });

  it('injects gtag.js and queues the config once consent is granted', async () => {
    const { Configured, write } = await renderConfigured();
    write('granted');
    renderWithI18n(<Configured />);

    const script = analyticsScript();
    expect(script).not.toBeNull();
    expect(script?.getAttribute('src')).toBe(
      `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`,
    );
    expect(
      window.dataLayer?.some((entry) => Array.isArray(entry) && entry[0] === 'config'),
    ).toBe(true);
  });

  it('does not inject a second tag on re-render', async () => {
    const { Configured, write } = await renderConfigured();
    write('granted');
    const { rerender } = renderWithI18n(<Configured />);
    rerender(<I18nProvider locale="en"><Configured /></I18nProvider>);
    expect(document.querySelectorAll('script[data-slipstream-analytics="true"]')).toHaveLength(1);
  });

  it('removes the tag and sets the opt-out flag when consent is withdrawn', async () => {
    const { Configured, write } = await renderConfigured();
    write('granted');
    renderWithI18n(<Configured />);
    expect(analyticsScript()).not.toBeNull();

    write('denied');

    expect(analyticsScript()).toBeNull();
    expect(
      (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`],
    ).toBe(true);
  });
});

describe('CookieBanner', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it('shows the consent region with accept and decline actions', () => {
    renderWithI18n(<CookieBanner />);
    expect(screen.getByRole('region', { name: /cookie consent/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /accept all/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /decline/i })).toBeTruthy();
  });

  it('hides itself after the visitor accepts', () => {
    const { container } = renderWithI18n(<CookieBanner />);
    fireEvent.click(screen.getByRole('button', { name: /accept all/i }));
    expect(container.querySelector('[data-cookie-banner]')).toBeNull();
  });

  it('does not render for a visitor who already decided', async () => {
    writeConsent('denied');
    const { container } = renderWithI18n(<CookieBanner />);
    // Consent resolves in an effect after the first paint.
    await waitFor(() =>
      expect(container.querySelector('[data-cookie-banner]')).toBeNull(),
    );
  });
});
