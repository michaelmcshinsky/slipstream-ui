import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/filter-chips', {
  title: 'FilterChips',
  description: 'Active-filter summary with removable chips and a clear-all action.',
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('filter-chips')} />;
}
