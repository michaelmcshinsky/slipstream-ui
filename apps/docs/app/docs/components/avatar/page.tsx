import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/avatar', {
  title: "Avatar",
  description: "A user profile image component with fallback support and accessible image loading.",
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('avatar')} />;
}
