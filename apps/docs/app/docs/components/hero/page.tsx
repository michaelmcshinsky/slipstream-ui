import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/hero', {
  title: 'Hero',
  description:
    'Responsive marketing hero with split, centered, stacked and overlay layouts, plus badge, eyebrow, actions and a media slot.',
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('hero')} />;
}
