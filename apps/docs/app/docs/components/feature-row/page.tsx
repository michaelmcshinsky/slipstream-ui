import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/feature-row', {
  title: 'FeatureRow',
  description: 'Alternating media and copy row for mid-page feature sections.',
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('feature-row')} />;
}
