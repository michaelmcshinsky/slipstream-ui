import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/grid', {
  title: 'Grid / GridItem',
  description:
    'Typed CSS grid with column counts per breakpoint, auto-fit min-column mode, and GridItem spans.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('grid')}
      id="grid"
      title="Grid / GridItem"
      description="Typed CSS grid with column counts per breakpoint (literal utilities that survive purging), auto-fit min-column mode, and GridItem spans."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'cols', type: 'number', description: 'Base column count (1-6).' },
        { name: 'smCols / mdCols / lgCols', type: 'number', description: 'Column counts from each breakpoint up (1-6).' },
        { name: 'minCol', type: 'string', description: 'Auto-fit mode: repeat(auto-fit, minmax(<minCol>, 1fr)): cards wrap responsively. Overrides cols*.' },
        { name: 'gap', type: "'none' | 'sm' | 'md' | 'lg' | 'xl'", defaultValue: "'md'", description: 'Token gap between cells.' },
        { name: 'as', type: "'div' | 'span' | 'section' | 'ul'", defaultValue: "'div'", description: "Semantic element (use 'ul' with GridItem as=\"li\")." },
        { name: 'span / smSpan / mdSpan / lgSpan', type: 'number', description: 'GridItem column spans per breakpoint (1-6).' },
      ]}
      accessibility={[
        'Visual column reflow never reorders DOM nodes: reading order equals source order.',
        'List grids pair as="ul" with GridItem as="li" for item semantics.',
        'Order cells by reading priority, not visual position.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
