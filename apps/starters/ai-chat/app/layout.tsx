import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Chat Starter - Slipstream UI',
  description:
    'A complete, backend-agnostic AI chat surface: streaming, reasoning, tool calls, approvals and citations, built with Slipstream UI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
