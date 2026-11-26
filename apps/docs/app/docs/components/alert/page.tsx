import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/alert', {
  title: "Alert",
  description: "Inline alert for status messages with semantic variants.",
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('alert')} />;
}
