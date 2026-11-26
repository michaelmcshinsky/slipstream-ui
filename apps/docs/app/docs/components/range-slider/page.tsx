import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/range-slider', {
  title: 'RangeSlider',
  description: 'Dual-thumb numeric range slider with labeled native inputs and formatted values.',
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('range-slider')} />;
}
