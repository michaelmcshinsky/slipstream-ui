import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/multi-select', {
  title: 'MultiSelect',
  description: 'Searchable multi-select filter with visible removable chips and a checkbox panel.',
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('multi-select')} />;
}
