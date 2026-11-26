import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/feature-grid', {
  title: 'FeatureGrid',
  description: 'Grid of feature or benefit cards with an icon, title, copy and optional link.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('feature-grid')}
      id="feature-grid"
      title="FeatureGrid"
      description="Grid of feature or benefit cards with an icon, title, copy and optional link."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'features', type: 'FeatureItem[]', defaultValue: 'required', description: 'Features: title, optional description, icon, href and actionLabel.' },
        { name: 'columns', type: '2 | 3 | 4', defaultValue: '3', description: 'Desktop column count.' },
        { name: 'variant', type: "'card' | 'plain'", defaultValue: "'card'", description: 'Card surface or a plain stack.' },
        { name: 'align', type: "'left' | 'center'", defaultValue: "'left'", description: 'Content alignment.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for routers.' },
      ]}
      accessibility={[
        'Renders ul/li so the group and item count are announced.',
        'A linked feature is one link; do not nest buttons inside it.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
