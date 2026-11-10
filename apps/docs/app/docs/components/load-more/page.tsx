import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/load-more', {
  title: 'LoadMore',
  description: 'Load-more control with pending and end-of-list states.',
});

export default function Page() {
  return <Demo />;
}
