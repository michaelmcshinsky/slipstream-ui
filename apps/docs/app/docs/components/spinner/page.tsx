import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/spinner', {
  title: "Spinner",
  description: "Indeterminate loading indicator with accessible status semantics.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('spinner')}
      id="spinner"
      title="Spinner"
      description="Indeterminate loading indicator with accessible status semantics."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'size', type: "'sm' | 'default' | 'lg'", defaultValue: "'default'", description: 'Visual size of the spinner.' },
        { name: 'label', type: 'string', defaultValue: "'Loading...'", description: 'Screen-reader label announced via role=status.' },
      ]}
      accessibility={[
        'Renders role="status" with an sr-only label so loading is announced.',
        'Set aria-hidden and an empty label when the spinner is purely decorative next to visible text.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
