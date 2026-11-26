import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/deal-card', {
  title: 'DealCard',
  description: 'Deal opportunity card with sector, status, metrics, NDA/CIM badges and access actions.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('deal-card')}
      id="deal-card"
      title="DealCard"
      description="Marketplace listing card with sector, status, metrics, access badges and actions."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Listing headline.' },
        { name: 'sector', type: 'string', defaultValue: 'required', description: 'Sector or industry label.' },
        { name: 'location', type: 'string', description: 'Region or location.' },
        { name: 'description', type: 'string', description: 'Optional short summary.' },
        { name: 'metrics', type: 'DealMetric[]', defaultValue: 'required', description: 'Three headline metrics.' },
        { name: 'status', type: "'available' | 'under-nda' | 'closed' | 'draft'", defaultValue: "'available'", description: 'Availability state.' },
        { name: 'ndaAvailable', type: 'boolean', description: 'Show the NDA badge.' },
        { name: 'cimAvailable', type: 'boolean', description: 'Show the CIM badge.' },
        { name: 'href', type: 'string', description: 'Optional detail link.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for routers.' },
        { name: 'saved', type: 'boolean', defaultValue: 'false', description: 'Save toggle state.' },
        { name: 'onSave', type: '() => void', description: 'Save toggle handler.' },
        { name: 'saveLabel', type: 'string', defaultValue: "'Save'", description: 'Save button label.' },
        { name: 'onRequestAccess', type: '() => void', description: 'Request access handler.' },
        { name: 'requestLabel', type: 'string', defaultValue: "'Request access'", description: 'Request access label.' },
      ]}
      accessibility={[
        'NDA and CIM access are text badges, never color or icons alone.',
        'Request access and Save are real buttons; Save exposes aria-pressed.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
