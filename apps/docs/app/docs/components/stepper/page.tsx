import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/stepper', {
  title: 'Stepper',
  description:
    'Multi-step flow indicator with horizontal, labels-below, vertical, and compact dots layouts, aria-current state, and centered titles when no description is present.',
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('stepper')} />;
}
