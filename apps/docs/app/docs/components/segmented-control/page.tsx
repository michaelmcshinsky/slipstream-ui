import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/segmented-control', {
  title: 'SegmentedControl',
  description: 'Single- or multi-select segmented control for view and filter switches.',
});

export default function Page() {
  return <Demo />;
}
