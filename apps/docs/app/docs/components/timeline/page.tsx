import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/timeline', {
  title: 'Timeline',
  description: 'Vertical chronology for experience, activity and audit trails.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('timeline')}
      id="timeline"
      title="Timeline"
      description="Vertical chronology for experience, activity and audit trails, built on an ordered list."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'items[].title', type: 'string', defaultValue: 'required', description: 'Entry heading.' },
        { name: 'items[].period', type: 'string', description: 'Date range or timestamp shown beside the title.' },
        { name: 'items[].description', type: 'string', description: 'Supporting detail under the title.' },
        { name: 'items[].icon', type: 'ReactNode', description: 'Optional marker glyph rendered before the title.' },
        { name: 'items[].muted', type: 'boolean', defaultValue: 'false', description: 'Dims the entry for ended/inactive periods.' },
      ]}
      accessibility={['Ordered-list semantics keep the sequence structural.', 'Muted entries dim visually; text content stays unchanged.']}
    >
      <Demo />
    </ComponentPage>
  );
}
