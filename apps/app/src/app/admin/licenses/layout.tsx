import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Licenses',
  description: 'Issue and manage license keys.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
