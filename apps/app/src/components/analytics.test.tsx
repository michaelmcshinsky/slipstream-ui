// @vitest-environment jsdom
import type { ReactElement } from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
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

describe('Analytics loader', () => {
  afterEach(() => {
    cleanup();
    document
      .querySelectorAll('script[data-slipstream-analytics="true"]')
      .forEach((node) => node.remove());
    delete (window as unknown as Record<string, unknown>)['ga-disable-G-QDQXNJV9MD'];
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

  it('injects gtag.js and queues the config once consent is granted', () => {
    writeConsent('granted');
    renderWithI18n(<Analytics />);

    const script = analyticsScript();
    expect(script).not.toBeNull();
    expect(script?.getAttribute('src')).toBe(
      'https://www.googletagmanager.com/gtag/js?id=G-QDQXNJV9MD',
    );
    expect(
      window.dataLayer?.some((entry) => Array.isArray(entry) && entry[0] === 'config'),
    ).toBe(true);
  });

  it('does not inject a second tag on re-render', () => {
    writeConsent('granted');
    const { rerender } = renderWithI18n(<Analytics />);
    rerender(<I18nProvider locale="en"><Analytics /></I18nProvider>);
    expect(document.querySelectorAll('script[data-slipstream-analytics="true"]')).toHaveLength(1);
  });

  it('removes the tag and sets the opt-out flag when consent is withdrawn', () => {
    writeConsent('granted');
    renderWithI18n(<Analytics />);
    expect(analyticsScript()).not.toBeNull();

    writeConsent('denied');

    expect(analyticsScript()).toBeNull();
    expect(
      (window as unknown as Record<string, unknown>)['ga-disable-G-QDQXNJV9MD'],
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
