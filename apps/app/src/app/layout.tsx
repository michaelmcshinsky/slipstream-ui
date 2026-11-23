import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { directionFor, getMessages, resolveLocale } from '@slipstream-ui/i18n';
import { I18nProvider } from '@slipstream-ui/i18n/react';
import '../styles/globals.css';
import { Analytics } from '@/components/analytics';
import { CookieBanner } from '@/components/cookie-banner';

export const metadata: Metadata = {
  title: { default: 'Slipstream Dashboard', template: '%s | Slipstream' },
  description: 'Manage your Slipstream UI license, team, and billing.',
  // Private product surface: never index it.
  robots: { index: false, follow: false },
};

/**
 * Applies the persisted theme before first paint so reloads never flash the
 * wrong color scheme. Runs inline in <head> by virtue of being rendered here.
 * Toggles the `.dark` class (token source of truth) and syncs
 * <meta name="color-scheme"> so UA chrome follows the same scheme.
 */
const THEME_INIT_SCRIPT = `
try {
  const stored = localStorage.getItem('slipstream-theme');
  const dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', dark);
  document.querySelectorAll('meta[name="color-scheme"]').forEach(function (meta) {
    meta.content = dark ? 'dark' : 'light';
  });
  // Mirror of parseStoredConsent in lib/analytics.ts: only a fresh timestamped
  // JSON choice counts as decided (180 days). Repeat visitors never see the
  // cookie banner flash.
  var consentRaw = localStorage.getItem('slipstream-consent');
  var consentDecided = false;
  if (consentRaw) {
    try {
      var consent = JSON.parse(consentRaw);
      consentDecided =
        (consent.v === 'granted' || consent.v === 'denied') &&
        typeof consent.at === 'number' &&
        (Date.now() - consent.at) < 15552000000;
    } catch (e) { consentDecided = false; }
  }
  if (consentDecided) {
    document.documentElement.classList.add('consent-decided');
  }
} catch {}
`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get('slipstream-locale')?.value);
  const messages = getMessages(locale);

  return (
    <html lang={locale} dir={directionFor(locale)} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <I18nProvider locale={locale} messages={messages}>
          {children}
          <CookieBanner />
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
