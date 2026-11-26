import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/cta-section', {
  title: 'CTASection',
  description: 'Full-width conversion band with eyebrow, headline, supporting copy and actions.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('cta-section')}
      id="cta-section"
      title="CTASection"
      description="Full-width conversion band with eyebrow, headline, supporting copy and actions."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Headline for the call to action.' },
        { name: 'description', type: 'string', description: 'Supporting copy under the headline.' },
        { name: 'eyebrow', type: 'string', description: 'Small overline above the headline.' },
        { name: 'actions', type: 'ReactNode', description: 'Buttons or links.' },
        { name: 'tone', type: "'default' | 'muted' | 'brand' | 'inverse'", defaultValue: "'inverse'", description: 'Surface treatment.' },
        { name: 'align', type: "'left' | 'center'", defaultValue: "'center'", description: 'Copy alignment.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Vertical space.' },
        { name: 'width', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", defaultValue: "'lg'", description: 'Inner container width.' },
      ]}
      accessibility={[
        'Renders an h2 under the page h1.',
        'Inverse tone scopes the token ladder, so semantic Button variants keep their contrast.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
