import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Licenses',
  description: 'Your license keys and activations.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
