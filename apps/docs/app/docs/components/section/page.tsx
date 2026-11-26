import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/section', {
  title: 'Section',
  description: 'Full-width page section with a surface tone, vertical rhythm and an optional centered container.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('section')}
      id="section"
      title="Section"
      description="Full-width page section with a surface tone, vertical rhythm and an optional centered container."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'tone', type: "'default' | 'muted' | 'subtle' | 'brand' | 'inverse'", defaultValue: "'default'", description: 'Surface treatment. inverse flips background, foreground, card, border and muted tokens for its subtree.' },
        { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg' | 'xl'", defaultValue: "'md'", description: 'Vertical rhythm.' },
        { name: 'width', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", defaultValue: "'lg'", description: 'Inner Container width.' },
        { name: 'container', type: 'boolean', defaultValue: 'true', description: 'Wrap children in a centered Container.' },
        { name: 'containerClassName', type: 'string', description: 'Extra classes for the inner Container.' },
        { name: 'as', type: "'section' | 'div' | 'article' | 'header' | 'footer' | 'main' | 'aside'", defaultValue: "'section'", description: 'Semantic element to render.' },
      ]}
      accessibility={[
        'tone="inverse" scopes background, foreground, card, border and muted tokens so child components stay readable.',
        'Add aria-label or aria-labelledby when the section is a named landmark.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
