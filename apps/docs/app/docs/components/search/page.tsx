import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/search', {
  title: 'Search',
  description:
    'Select-with-search: type to filter a full-width dropdown of options, or arrow through the full set from an empty query.',
});

export default function Page() {
  return <Demo />;
}
