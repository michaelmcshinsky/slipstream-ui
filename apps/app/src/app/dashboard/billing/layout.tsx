import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Billing',
  description: 'Manage your plan, payment method and invoices.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
