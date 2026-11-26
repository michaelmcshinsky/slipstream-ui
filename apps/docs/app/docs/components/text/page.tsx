import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/text', {
  title: 'Text',
  description:
    'Semantic paragraph text with a controlled type scale; renders a real p (or span with inline).',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('text')}
      id="text"
      title="Text"
      description="Semantic paragraph text with a controlled type scale; renders a real p (or span with inline)."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'inline', type: 'boolean', defaultValue: 'false', description: 'Render as an inline span instead of a block p.' },
        { name: 'size', type: "'xs' | 'sm' | 'base' | 'lg' | 'xl'", defaultValue: "'base'", description: 'Type scale step.' },
        { name: 'weight', type: "'normal' | 'medium' | 'semibold' | 'bold'", description: 'Font weight.' },
        { name: 'muted', type: 'boolean', defaultValue: 'false', description: 'Use the muted-foreground token.' },
      ]}
      accessibility={[
        'Renders real <p>/<span>: document semantics stay intact for reader modes and assistive tech.',
        'Muted tone uses --muted-foreground (AA in both themes).',
        'Never use Text where a Heading belongs: outline navigation depends on headings.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
