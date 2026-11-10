import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/filter-panel', {
  title: 'FilterPanel',
  description: 'Structured filter panel with collapsible sections and reset/apply actions.',
});

export default function Page() {
  return <Demo />;
}
