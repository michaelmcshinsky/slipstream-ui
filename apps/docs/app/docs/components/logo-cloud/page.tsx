import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/logo-cloud', {
  title: 'LogoCloud',
  description: 'Trust strip for member, customer or partner logos with captions, columns and optional links.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('logo-cloud')}
      id="logo-cloud"
      title="LogoCloud"
      description="Trust strip for member, customer or partner logos with captions, columns and optional links."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'items', type: 'LogoItem[]', defaultValue: 'required', description: 'Logos: accessible name, decorative artwork and optional href.' },
        { name: 'caption', type: 'string', description: 'Caption above the strip.' },
        { name: 'columns', type: '3 | 4 | 5 | 6', defaultValue: '4', description: 'Desktop column count.' },
        { name: 'grayscale', type: 'boolean', defaultValue: 'true', description: 'Desaturate logos until hover.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Logo box height.' },
        { name: 'align', type: "'left' | 'center'", defaultValue: "'center'", description: 'Caption and grid alignment.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for routers.' },
        { name: 'linkHrefProp', type: "'href' | 'to'", defaultValue: "'href'", description: 'Prop used to pass the destination to linkComponent (to for react-router style routers).' },
      ]}
      accessibility={[
        'Logos are decorative; the item name is announced once through sr-only text.',
        'Linked logos are a single focusable link named by the item.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
