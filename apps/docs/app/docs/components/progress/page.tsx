import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/progress', {
  title: "Progress",
  description: "Determinate progress bar with role=progressbar and exact value semantics.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('progress')}
      id="progress"
      title="Progress"
      description="Determinate progress bar with role=progressbar and exact value semantics."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'value', type: 'number', defaultValue: '0', description: 'Current value between 0 and max.' },
        { name: 'max', type: 'number', defaultValue: '100', description: 'Upper bound of the progress scale.' },
        { name: 'label', type: 'string', description: 'Accessible label announced by screen readers.' },
      ]}
      accessibility={[
        'role="progressbar" with aria-valuenow/min/max so assistive tech reports the exact percentage.',
        'Provide an accessible label describing the task.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
