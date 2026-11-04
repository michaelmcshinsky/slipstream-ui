import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Profile, security and notification preferences.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
