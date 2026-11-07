import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'LinkTabs',
  description:
    'Route-driven navigation tabs that render real links and mark the current path with aria-current.',
};

export default function Page() {
  return <Demo />;
}
