import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/heading', {
  title: 'Heading',
  description:
    'Semantic heading (h1-h6) with a safe default scale and an optional visual-size override.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('heading')}
      id="heading"
      title="Heading"
      description="Semantic heading (h1-h6) with a safe default scale and an optional visual-size override."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'level', type: '1 | 2 | 3 | 4 | 5 | 6', defaultValue: 'required', description: 'Semantic level: renders the matching h1..h6 element.' },
        { name: "size", type: "'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'", description: 'Visual size override, independent of the semantic level.' },
        { name: 'muted', type: 'boolean', defaultValue: 'false', description: 'Use the muted-foreground token instead of the primary text color.' },
      ]}
      accessibility={[
        'Renders real h1..h6 elements: indexable by find-in-page and outline panes.',
        'One h1 per page; never skip levels (use size for visual weight instead).',
        'Muted tone uses --muted-foreground (AA in both themes).',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
