import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/button-group', {
  title: 'ButtonGroup',
  description:
    'Joins buttons into one segmented control: adjacent borders collapse, middle corners square off, only the outer corners stay rounded.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('button-group')}
      id="button-group"
      title="ButtonGroup"
      description="Joins buttons into one segmented control: adjacent borders collapse, middle corners square off, and only the outer corners stay rounded: a single outline around the group."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'orientation', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: 'Stacked segments share vertical edges; default lays them side by side.' },
        { name: 'children', type: 'ReactNode', description: 'Direct Button children: each keeps its own variant/size but must keep a border.' },
      ]}
      accessibility={[
        'role=group: always pass aria-label (or aria-labelledby) so the group name precedes its buttons.',
        'Focus rings lift above neighbours (relative + z-10) instead of clipping.',
        'Native tab order; for exclusive views with panels prefer Tabs.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
