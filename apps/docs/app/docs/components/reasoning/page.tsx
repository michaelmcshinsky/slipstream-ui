import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/reasoning', {
  title: "Reasoning",
  description: "A collapsible component for displaying AI reasoning steps and chain-of-thought processes.",
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('reasoning')} />;
}
