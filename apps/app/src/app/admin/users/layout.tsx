import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Search users, change roles and impersonate accounts.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
