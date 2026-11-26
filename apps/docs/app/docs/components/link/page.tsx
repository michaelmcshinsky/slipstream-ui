import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/link', {
  title: 'Link',
  description: 'Inline link primitive with variants, asChild router support and safe external handling.',
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('link')} />;
}
