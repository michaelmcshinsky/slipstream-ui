import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/tombstone-card', {
  title: 'TombstoneCard',
  description: 'Placeholder card for archived, closed or unavailable marketplace items.',
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('tombstone-card')} />;
}
