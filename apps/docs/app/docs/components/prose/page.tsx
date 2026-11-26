import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/prose', {
  title: 'Prose',
  description: 'Self-contained long-form typography for rendered markdown/MDX.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('prose')}
      id="prose"
      title="Prose"
      description="Self-contained long-form typography for rendered markdown/MDX: headings, links, lists, code, tables, quotes and figures."
      npmPackages="@slipstream-ui/core"
      propsRows={[{ name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Type scale for body and headings.' }]}
      accessibility={['Heading anchors carry scroll-mt offsets for sticky headers.', 'Links keep the primary color and underline for recognition.']}
    >
      <Demo />
    </ComponentPage>
  );
}
