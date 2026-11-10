import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/filter-bar', {
  title: 'FilterBar',
  description:
    'List-page filter strip: search field, filter controls, reset affordance and trailing actions.',
});

export default function Page() {
  return <Demo />;
}
