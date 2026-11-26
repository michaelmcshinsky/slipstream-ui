import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/separator', {
  title: "Separator",
  description: "Visual divider between content blocks, decorative or semantic.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('separator')}
      id="separator"
      title="Separator"
      description="Visual divider between content blocks, decorative or semantic."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'orientation', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: 'Direction of the divider line.' },
        { name: 'label', type: 'string', description: 'Accessible name; when set, the separator becomes semantic.' },
      ]}
      accessibility={[
        'Decorative by default (role=none) so screen readers skip it.',
        'Pass a label to make it a semantic separator.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
