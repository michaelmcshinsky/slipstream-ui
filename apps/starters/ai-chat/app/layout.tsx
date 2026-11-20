import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { directionFor, getMessages, resolveLocale, translate } from '@slipstream-ui/i18n';
import { I18nProvider } from '@slipstream-ui/i18n/react';
import { Analytics } from '@/src/components/analytics';
import './globals.css';

async function requestLocale() {
  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get('slipstream-locale')?.value);
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const messages = getMessages(locale);
  return {
    title: translate(messages, 'app.title'),
    description: translate(messages, 'app.subtitle'),
  };
}

/**
 * Applies the persisted theme before first paint so reloads never flash the
 * wrong color scheme. Runs inline in <head> by virtue of being rendered here.
 * Updates <meta name="color-scheme"> to sync with localStorage override.
 */
const THEME_INIT_SCRIPT = `
try {
  const stored = localStorage.getItem('slipstream-theme');
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    meta.content = 'dark';
  } else if (stored === 'light') {
    meta.content = 'light';
  }
} catch {}
`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await requestLocale();
  const messages = getMessages(locale);

  return (
    <html lang={locale} dir={directionFor(locale)}>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen antialiased">
        <I18nProvider locale={locale} messages={messages}>
          {children}
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
