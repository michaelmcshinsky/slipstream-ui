import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/tombstone-card', {
  title: 'TombstoneCard',
  description: 'Placeholder card for archived, closed or unavailable marketplace items.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('tombstone-card')}
      id="tombstone-card"
      title="TombstoneCard"
      description="Placeholder card for archived, closed or unavailable marketplace items."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Listing, item or document name.' },
        { name: 'reason', type: 'string', description: 'Why the item is unavailable.' },
        { name: 'status', type: "'archived' | 'unavailable' | 'closed'", defaultValue: "'unavailable'", description: 'Unavailable state.' },
        { name: 'logo', type: 'ReactNode', description: 'Logo or document icon slot.' },
        { name: 'href', type: 'string', description: 'Optional detail destination.' },
        { name: 'actionLabel', type: 'string', defaultValue: "'View details'", description: 'Link label.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for routers.' },
      ]}
      accessibility={[
        'The unavailable state is a text badge, not color alone.',
        'The reason stays visible so a saved link still explains the state.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
