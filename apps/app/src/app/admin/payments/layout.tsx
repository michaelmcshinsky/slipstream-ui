import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payments',
  description: 'Review payments and issue refunds.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
