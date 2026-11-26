import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/list', {
  title: 'List / ListItem',
  description:
    'Semantic list (ul/li) for rows of related items: settings, results, nav: with slots, selection, and pressable rows.',
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('list')} />;
}
