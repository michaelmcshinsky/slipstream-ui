import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/comparison-table', {
  title: 'ComparisonTable',
  description: 'Marketing comparison table with check/dash boolean cells, a highlighted column and responsive overflow.',
});

export default function Page() {
  return <Demo />;
}
