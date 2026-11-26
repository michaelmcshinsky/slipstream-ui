import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/applied-filters', {
  title: 'AppliedFilters',
  description: 'Applied-filter summary with a live count, removable chips and an edit action.',
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('applied-filters')} />;
}
