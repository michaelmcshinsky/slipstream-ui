import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { directionFor, getMessages, resolveLocale, translate } from '@slipstream-ui/i18n';
import { I18nProvider } from '@slipstream-ui/i18n/react';
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await requestLocale();
  const messages = getMessages(locale);

  return (
    <html lang={locale} dir={directionFor(locale)}>
      <body className="min-h-screen antialiased">
        <I18nProvider locale={locale} messages={messages}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
