import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { directionFor, getMessages, resolveLocale } from '@slipstream-ui/i18n';
import { I18nProvider } from '@slipstream-ui/i18n/react';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: { default: 'Slipstream Dashboard', template: '%s | Slipstream' },
  description: 'Manage your Slipstream UI license, team, and billing.',
  // Private product surface: never index it.
  robots: { index: false, follow: false },
};

/**
 * Applies the persisted theme before first paint so reloads never flash the
 * wrong color scheme. Runs inline in <head> by virtue of being rendered here.
 */
const THEME_INIT_SCRIPT = `
try {
  const stored = localStorage.getItem('slipstream-theme');
  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
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
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <I18nProvider locale={locale} messages={messages}>{children}</I18nProvider>
      </body>
    </html>
  );
}
