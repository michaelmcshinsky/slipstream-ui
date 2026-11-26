import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/inline-citation', {
  title: "InlineCitation",
  description: "Perplexity-style inline citation: a superscript chip that reveals the source title and snippet on hover or keyboard focus. Use it to attribute individual claims inside a response; use Sources for the footer list.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('inline-citation')}
      id="inline-citation"
      title="InlineCitation"
      description="Perplexity-style inline citation: a superscript chip that reveals the source title and snippet on hover or keyboard focus. Use it to attribute individual claims inside a response; use Sources for the footer list."
      propsRows={[
        { name: 'source', type: 'SourceItem', description: 'Cited source powering the preview card.' },
        { name: 'children', type: 'ReactNode', description: 'Wrapped text; defaults to the source title.' },
      ]}
      accessibility={[
        'Trigger is a focusable button; the card opens via focus-within.',
        'Card has role=tooltip linked by aria-describedby.',
        'Keep inline citations one-per-claim; long lists belong in Sources.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
