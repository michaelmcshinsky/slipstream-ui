import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/tool-call', {
  title: "ToolCall",
  description: "A component for displaying AI tool/function calls with status, arguments, and results.",
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('tool-call')} />;
}
