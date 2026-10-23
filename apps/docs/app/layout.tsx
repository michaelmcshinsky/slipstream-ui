import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Slipstream UI - The AI-first React Component Library',
    template: '%s · Slipstream UI',
  },
  description:
    'Your AI already knows your design system. Every component ships a machine-readable manifest so Claude, Cursor, and Copilot generate correct UI the first time.',
  keywords: ['AI components', 'React', 'component library', 'MCP', 'shadcn', 'chat UI', 'Tailwind'],
  authors: [{ name: 'Slipstream UI' }],
  openGraph: {
    type: 'website',
    siteName: 'Slipstream UI',
    title: 'Slipstream UI - The AI-first React Component Library',
    description:
      '21 AI-native React components, each shipping a machine-readable COMPONENT_MANIFEST, an MCP server, and a usage validator that keeps agents honest.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slipstream UI',
    description: 'The AI-first React component library — your AI reads the spec, not the source.',
  },
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
      <body>{children}</body>
    </html>
  );
}
