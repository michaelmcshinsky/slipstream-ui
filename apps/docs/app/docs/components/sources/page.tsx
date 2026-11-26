import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/sources', {
  title: "Sources",
  description: "Show citations and references alongside an AI response. Sources renders a numbered list; Source renders a single citation for custom layouts.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('source')}
      id="sources"
      manifestId="source"
      title="Sources"
      description="Show citations and references alongside an AI response. Sources renders a numbered list; Source renders a single citation for custom layouts."
      npmPackages="@slipstream-ui/ai"
      propsRows={[
        { name: 'sources', type: 'SourceItem[]', description: 'References to display (Sources).' },
        { name: 'maxDisplay', type: 'number', defaultValue: '3', description: 'Max references before an overflow indicator.' },
        { name: 'label', type: 'string', defaultValue: "'Sources'", description: 'Heading label; override for localization.' },
        { name: 'index', type: 'number', description: '1-based citation marker rendered as [n] (Source).' },
      ]}
      accessibility={[
        'References use native links with rel="noopener noreferrer".',
        'Citation markers are aria-hidden; titles are read as link text.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
