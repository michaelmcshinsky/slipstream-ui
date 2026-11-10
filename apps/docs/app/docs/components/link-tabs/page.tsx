import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/link-tabs', {
  title: 'LinkTabs',
  description:
    'Route-driven navigation tabs that render real links and mark the current path with aria-current.',
});

export default function Page() {
  return <Demo />;
}
