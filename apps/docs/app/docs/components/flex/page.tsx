import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/flex', {
  title: 'Flex / FlexItem',
  description:
    'Typed flexbox container (direction/align/justify/wrap/gap) with FlexItem for per-child grow/shrink/basis controls.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('flex')}
      id="flex"
      title="Flex / FlexItem"
      description="Typed flexbox container (direction/align/justify/wrap/gap) with FlexItem for per-child grow/shrink/basis controls."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'direction', type: "'row' | 'column'", defaultValue: "'row'", description: 'Main axis direction.' },
        { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", description: 'Cross-axis alignment (align-items; align-self on FlexItem).' },
        { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", description: 'Main-axis distribution (justify-content).' },
        { name: 'wrap', type: 'boolean', defaultValue: 'false', description: 'Allow items to wrap onto multiple lines.' },
        { name: 'gap', type: "'none' | 'sm' | 'md' | 'lg' | 'xl'", defaultValue: "'md'", description: 'Token gap between children.' },
        { name: 'as', type: "'div' | 'span' | 'section' | 'article' | 'nav' | 'header' | 'footer'", defaultValue: "'div'", description: 'Semantic element.' },
        { name: 'grow / shrink / basis', type: 'boolean | string / string', description: 'Per-child flex values on FlexItem: emitted as inline style so nothing gets purged.' },
      ]}
      accessibility={[
        'Layout-only semantics: flex-wrap reflows visually while DOM (reading) order never changes.',
        'Interactive children keep their own keyboard/ARIA contracts.',
        'Put items in logical reading order regardless of visual layout.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
