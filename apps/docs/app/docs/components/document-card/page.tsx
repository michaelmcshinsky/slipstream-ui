import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/document-card', {
  title: 'DocumentCard',
  description: 'Document row with file metadata, access status and an optional download action.',
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('document-card')} />;
}
