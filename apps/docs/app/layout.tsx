import type { Metadata } from 'next';
import './globals.css';
import { COMPONENT_COUNT } from '@/lib/component-count';
import { Analytics } from '@/components/site/analytics';
import { CookieBanner } from '@/components/site/cookie-banner';

export const metadata: Metadata = {
  metadataBase: new URL('https://slipstreamui.com'),
  title: {
    default: 'Slipstream UI - The AI-first React Component Library',
    template: '%s · Slipstream UI',
  },
  description:
    'Your AI already knows your design system. Every component ships a machine-readable manifest so Claude, Cursor, and Copilot generate correct UI the first time.',
  keywords: ['AI components', 'React', 'component system', 'MCP', 'shadcn', 'chat UI', 'Tailwind', 'design system'],
  authors: [{ name: 'Slipstream UI' }],
  creator: 'Slipstream UI',
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
  robots: { index: true, follow: true },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to content
        </a>
        {children}
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}
