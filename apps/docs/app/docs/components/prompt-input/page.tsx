import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/prompt-input', {
  title: "PromptInput",
  description: "Auto-resizing chat input with Enter-to-send, Shift+Enter for newlines, and a stop-generation button while a response is in flight. Also composes as a compound primitive set for custom layouts.",
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('prompt-input')} />;
}
