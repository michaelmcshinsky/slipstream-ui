import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/testimonial', {
  title: 'Testimonial',
  description: 'Semantic written testimonial with quote, person, role, company, avatar and logo slots.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('testimonial')}
      id="testimonial"
      title="Testimonial"
      description="Semantic written testimonial with quote, person, role, company, avatar and logo slots."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'quote', type: 'string', defaultValue: 'required', description: 'Testimonial copy without quotation marks.' },
        { name: 'name', type: 'string', defaultValue: 'required', description: 'Person or company name.' },
        { name: 'role', type: 'string', description: 'Role or title.' },
        { name: 'company', type: 'string', description: 'Company name.' },
        { name: 'avatar', type: 'ReactNode', description: 'Avatar slot.' },
        { name: 'logo', type: 'ReactNode', description: 'Brand or logo slot.' },
        { name: 'variant', type: "'card' | 'plain'", defaultValue: "'card'", description: 'Card surface or plain quote.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Quote scale.' },
      ]}
      accessibility={[
        'Renders figure, blockquote and figcaption so the attribution is structural.',
        'The quote prop should not include quotation marks; the component adds them.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
