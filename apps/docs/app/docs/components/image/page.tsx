import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/image', {
  title: 'Image',
  description:
    'Resilient image with a two-step fallback chain, intrinsic dimensions and an LCP priority flag.',
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('image')} />;
}
