import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/link', {
  title: 'Link',
  description: 'Inline link primitive with variants, asChild router support and safe external handling.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('link')}
      id="link"
      title="Link"
      description="Inline link primitive with default/muted/underline/arrow/external variants, asChild router support and safe external handling."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'href', type: 'string', description: 'Destination URL (or pass it on the asChild element).' },
        { name: 'variant', type: "'default' | 'muted' | 'underline' | 'arrow' | 'external'", defaultValue: "'default'", description: 'Visual style.' },
        { name: 'asChild', type: 'boolean', defaultValue: 'false', description: 'Render the child (router Link) with link styling.' },
        { name: 'external', type: 'boolean', description: 'Force external handling. Absolute http(s) URLs are auto-detected; mailto/tel never open a new tab.' },
      ]}
      accessibility={[
        'Renders a real <a href>, so middle-click and modified clicks behave like the platform.',
        'External links get rel="noopener noreferrer" and an sr-only “opens in a new tab” note.',
        'Focus ring is visible on keyboard focus.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
