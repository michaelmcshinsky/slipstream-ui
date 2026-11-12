import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { directionFor, getMessages, resolveLocale, translate } from '@slipstream-ui/i18n';
import { I18nProvider } from '@slipstream-ui/i18n/react';
import './globals.css';
import { COMPONENT_COUNT } from '@/lib/component-count';
import { Analytics } from '@/components/site/analytics';
import { CookieBanner } from '@/components/site/cookie-banner';
import { JsonLd } from '@/components/site/json-ld';
import { organizationSchema, websiteSchema } from '@/lib/structured-data';

export const metadata: Metadata = {
  metadataBase: new URL('https://slipstreamui.com'),
  applicationName: 'Slipstream UI',
  title: {
    default: 'Slipstream UI - The AI-first React Component Library',
    template: '%s · Slipstream UI',
  },
  description:
    'Your AI already knows your design system. Every component ships a machine-readable manifest so Claude, Cursor, and Copilot generate correct UI the first time.',
  keywords: [
    'AI components',
    'React component library',
    'AI-first React',
    'component manifest',
    'MCP',
    'shadcn',
    'chat UI',
    'Tailwind',
    'design system',
    'AI coding agents',
  ],
  authors: [{ name: 'Slipstream UI', url: 'https://slipstreamui.com/about' }],
  creator: 'Slipstream UI',
  publisher: 'Slipstream UI',
  category: 'technology',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Slipstream UI',
    url: '/',
    title: 'Slipstream UI - The AI-first React Component Library',
    description:
      `${COMPONENT_COUNT} AI-native React components, each shipping a machine-readable COMPONENT_MANIFEST, an MCP server, and a usage validator that keeps agents honest.`,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Slipstream UI — the AI-first React component library',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slipstream UI',
    description: 'The AI-first React component library — your AI reads the spec, not the source.',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  referrer: 'origin-when-cross-origin',
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111113' },
  ],
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
  if (localStorage.getItem('slipstream-consent')) {
    document.documentElement.classList.add('consent-decided');
  }
} catch {}
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get('slipstream-locale')?.value);
  const messages = getMessages(locale);
  return (
    <html lang={locale} dir={directionFor(locale)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          {translate(messages, 'shell.skipToContent')}
        </a>
        <I18nProvider locale={locale} messages={messages}>
          {children}
          <CookieBanner />
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
