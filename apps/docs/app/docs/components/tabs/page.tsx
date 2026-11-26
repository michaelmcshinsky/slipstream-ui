import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/tabs', {
  title: "Tabs",
  description: "Tabbed content container with ARIA tablist semantics and keyboard navigation.",
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('tabs')} />;
}
