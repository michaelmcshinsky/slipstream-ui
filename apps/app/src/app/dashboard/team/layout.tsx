import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team',
  description: 'Invite teammates and manage roles.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
