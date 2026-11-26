import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/process-steps', {
  title: 'ProcessSteps',
  description: 'Ordered process cards with derived step numbers or custom icons.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('process-steps')}
      id="process-steps"
      title="ProcessSteps"
      description="Ordered process cards with derived step numbers or custom icons."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'steps', type: 'ProcessStep[]', defaultValue: 'required', description: 'Ordered steps: title, optional description and icon.' },
        { name: 'columns', type: '2 | 3 | 4', defaultValue: '3', description: 'Desktop column count.' },
        { name: 'numbered', type: 'boolean', defaultValue: 'true', description: 'Show step numbers when no icon is provided.' },
        { name: 'align', type: "'left' | 'center'", defaultValue: "'left'", description: 'Content alignment.' },
        { name: 'headingLevel', type: '2 | 3 | 4', defaultValue: '3', description: 'Heading level for step titles; choose the level that continues the page outline without skipping a rank.' },
      ]}
      accessibility={[
        'Renders an ordered list, so the sequence is structural.',
        'Step numbers are derived from list order; do not hardcode them in titles.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
