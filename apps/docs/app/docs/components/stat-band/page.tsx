import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/stat-band', {
  title: 'StatBand',
  description: 'Semantic description list of headline stats with labels, optional hints and column presets.',
});

export default function Page() {
  return <Demo />;
}
