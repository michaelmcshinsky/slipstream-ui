import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/streaming-indicator', {
  title: "StreamingIndicator",
  description: "Give immediate feedback while an assistant response is arriving.",
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('streaming-indicator')} />;
}
