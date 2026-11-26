import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/stat-band', {
  title: 'StatBand',
  description: 'Semantic description list of headline stats with labels, optional hints and column presets.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('stat-band')}
      id="stat-band"
      title="StatBand"
      description="Semantic description list of headline stats with labels, optional hints and column presets."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'items', type: 'StatItem[]', defaultValue: 'required', description: 'Stats to display: value, label and optional hint.' },
        { name: 'columns', type: '2 | 3 | 4', defaultValue: '3', description: 'Desktop column count.' },
        { name: 'align', type: "'left' | 'center'", defaultValue: "'center'", description: 'Copy alignment.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Value scale.' },
        { name: 'divided', type: 'boolean', defaultValue: 'true', description: 'Draw dividers between stats at sm and up.' },
      ]}
      accessibility={[
        'Renders dl/dt/dd so each number is structurally paired with its label.',
        'Labels are read before values even though the value appears first visually.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
