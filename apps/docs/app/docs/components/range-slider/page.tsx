import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/range-slider', {
  title: 'RangeSlider',
  description: 'Dual-thumb numeric range slider with labeled native inputs and formatted values.',
});

export default function Page() {
  return <Demo />;
}
