import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/separator', {
  title: "Separator",
  description: "Visual divider between content blocks, decorative or semantic.",
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('separator')} />;
}
