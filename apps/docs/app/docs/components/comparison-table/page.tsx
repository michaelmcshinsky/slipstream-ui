import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/comparison-table', {
  title: 'ComparisonTable',
  description: 'Marketing comparison table with check/dash boolean cells, a highlighted column and responsive overflow.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('comparison-table')}
      id="comparison-table"
      title="ComparisonTable"
      description="Marketing comparison table with check/dash boolean cells, a highlighted column and responsive overflow."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'columns', type: 'ComparisonColumn[]', defaultValue: 'required', description: 'Comparison columns, excluding the feature column. Each column has a label and optional highlight.' },
        { name: 'rows', type: 'ComparisonRow[]', defaultValue: 'required', description: 'Feature rows with one value per column. Booleans render check/dash; strings render as text.' },
        { name: 'caption', type: 'string', defaultValue: "'Comparison'", description: 'Accessible table caption.' },
        { name: 'featureLabel', type: 'string', defaultValue: "'Feature'", description: 'Heading for the feature column.' },
        { name: 'valueLabels', type: '{ yes?: string; no?: string }', description: 'Screen-reader labels for boolean cells.' },
      ]}
      accessibility={[
        'Renders a real table with caption, scope=col and scope=row.',
        'Boolean cells pair the visual check/dash with screen-reader Included/Not included text.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
