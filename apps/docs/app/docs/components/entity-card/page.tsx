import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/entity-card', {
  title: 'EntityCard',
  description: 'Firm or member profile card with logo, type, location, stats, tags and actions.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('entity-card')}
      id="entity-card"
      title="EntityCard"
      description="Profile card with logo, type, location, stats, tags and actions."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'name', type: 'string', defaultValue: 'required', description: 'Firm or member name.' },
        { name: 'entityType', type: 'string', defaultValue: 'required', description: 'Firm type, role or member category.' },
        { name: 'location', type: 'string', description: 'Region or office location.' },
        { name: 'description', type: 'string', description: 'Short firm description.' },
        { name: 'logo', type: 'ReactNode', description: 'Logo slot; initials are used when omitted.' },
        { name: 'stats', type: 'EntityStat[]', description: 'Small stats such as projects delivered.' },
        { name: 'tags', type: 'string[]', description: 'Sector or service tags.' },
        { name: 'href', type: 'string', description: 'Profile destination.' },
        { name: 'cardHref', type: 'string', description: 'Whole-card stretched link; suppresses the footer link.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for routers.' },
        { name: 'linkHrefProp', type: "'href' | 'to'", defaultValue: "'href'", description: 'Prop name used to pass the destination to linkComponent.' },
        { name: 'actions', type: 'ReactNode', description: 'Extra footer actions.' },
      ]}
      accessibility={[
        'The title and footer link are the destinations; cardHref makes the whole card one stretched link with actions layered above.',
        'The avatar fallback derives initials from the name.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
