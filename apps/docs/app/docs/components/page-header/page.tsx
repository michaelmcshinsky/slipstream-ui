import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/page-header', {
  title: 'PageHeader',
  description:
    'Standard page heading: breadcrumbs, level-1 title, description, action cluster and a sub-row slot.',
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('page-header')} />;
}
