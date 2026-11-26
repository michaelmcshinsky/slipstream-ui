import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/form-layout', {
  title: 'FormLayout',
  description:
    'Groups form fields with even, tokenized spacing: vertical stack, horizontal row, or 1-4 column grid, optionally as a semantic fieldset.',
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('form-layout')} />;
}
