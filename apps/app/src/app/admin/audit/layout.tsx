import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Audit log',
  description: 'Security-relevant actions across the account.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
