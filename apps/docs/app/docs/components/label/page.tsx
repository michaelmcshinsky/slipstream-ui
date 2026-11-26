import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/label', {
  title: "Label",
  description: "Accessible form label that associates with its control.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('label')}
      id="label"
      title="Label"
      description="Accessible form label that associates with its control."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'htmlFor', type: 'string', description: 'The id of the control this label describes.' },
        { name: 'children', type: 'ReactNode', description: 'The label text.' },
      ]}
      accessibility={[
        'htmlFor/id pairing links the label to its control.',
        'Placeholders are not a replacement for labels.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
