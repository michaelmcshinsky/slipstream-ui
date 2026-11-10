import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/applied-filters', {
  title: 'AppliedFilters',
  description: 'Applied-filter summary with a live count, removable chips and an edit action.',
});

export default function Page() {
  return <Demo />;
}
