import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/site-footer', {
  title: 'SiteFooter',
  description: 'Marketing footer with brand, link columns and a legal bar.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('site-footer')}
      id="site-footer"
      title="SiteFooter"
      description="Marketing footer: brand + tagline column, link columns and a legal bar; router-agnostic via linkComponent."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'brand', type: 'ReactNode', description: 'Brand slot.' },
        { name: 'tagline', type: 'string', description: 'Short line under the brand.' },
        { name: 'contact', type: 'ReactNode', description: 'Contact block under the tagline (address, email, phone).' },
        { name: 'columns', type: 'SiteFooterColumn[]', defaultValue: 'required', description: 'Link columns: { title, links: { label, href, external? }[] }.' },
        { name: 'legal', type: 'ReactNode', description: 'Bottom bar (copyright, legal links).' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Router link element.' },
        { name: 'linkHrefProp', type: "'href' | 'to'", defaultValue: "'href'", description: 'Prop used to pass the destination to linkComponent.' },
        { name: 'activeHref', type: 'string', description: 'Current route; marks the matching link aria-current="page".' },
        { name: 'match', type: "'prefix' | 'exact'", defaultValue: "'prefix'", description: 'Prefix matching highlights /docs when on /docs/installation.' },
      ]}
      accessibility={['Renders a <footer> landmark with headed link groups.', 'External links get target=_blank + rel=noopener.']}
    >
      <Demo />
    </ComponentPage>
  );
}
