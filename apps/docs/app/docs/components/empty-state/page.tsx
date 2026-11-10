import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/empty-state', {
  title: 'EmptyState',
  description:
    'Placeholder for empty collections and zero-result searches: icon, title, description and actions.',
});

export default function Page() {
  return <Demo />;
}
