import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Slipstream UI - The AI-first React Component Library',
  description: 'Your AI already knows your design system. Every component ships a machine-readable manifest so Claude, Cursor, and Copilot generate correct UI the first time.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
