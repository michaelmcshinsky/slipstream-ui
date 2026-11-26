import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/block', {
  title: 'Block',
  description:
    'Semantic container (div by default, swappable element): the structural counterpart to Text (p).',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('block')}
      id="block"
      title="Block"
      description="Semantic container (div by default, swappable element): the structural counterpart to Text (p)."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'as', type: "'div' | 'span' | 'section' | 'article' | 'figure' | 'header' | 'footer' | 'nav' | 'main' | 'aside'", defaultValue: "'div'", description: 'Semantic element to render.' },
        { name: 'inline', type: 'boolean', defaultValue: 'false', description: 'Shorthand for as="span": inline flow.' },
        { name: 'muted', type: 'boolean', defaultValue: 'false', description: "Use the muted-foreground token for the block's text." },
      ]}
      accessibility={[
        'Element choice is explicit: pick the element matching the content role (section/article/figure).',
        'Block adds no interactive behavior; children keep their own keyboard/ARIA contracts.',
        'Copy belongs in Text (p), not Block: document semantics stay queryable.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
