import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/contact-strip', {
  title: 'ContactStrip',
  description: 'Compact labelled contact rows with optional icons and links.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('contact-strip')}
      id="contact-strip"
      title="ContactStrip"
      description="Compact labelled contact rows with optional icons and links."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'items', type: 'ContactItem[]', defaultValue: 'required', description: 'Contact rows: label, value, optional href and icon.' },
        { name: 'columns', type: '2 | 3', defaultValue: '2', description: 'Desktop column count.' },
        { name: 'align', type: "'left' | 'center'", defaultValue: "'left'", description: 'Row alignment.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for routers.' },
        { name: 'linkHrefProp', type: "'href' | 'to'", defaultValue: "'href'", description: 'Prop name used to pass the destination to linkComponent.' },
      ]}
      accessibility={[
        'Renders a list with one label and value per contact row.',
        'Phone and email links use tel: and mailto: destinations.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
