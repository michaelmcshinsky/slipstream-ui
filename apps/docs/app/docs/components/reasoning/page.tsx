import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/reasoning', {
  title: "Reasoning",
  description: "A collapsible component for displaying AI reasoning steps and chain-of-thought processes.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('reasoning')}
      id="reasoning"
      title="Reasoning"
      description="A collapsible component for displaying AI reasoning steps and chain-of-thought processes."
      propsRows={[
        { name: 'steps', type: 'ReasoningStep[]', defaultValue: 'required', description: 'Array of reasoning steps' },
        { name: 'collapsible', type: 'boolean', defaultValue: 'true', description: 'Whether reasoning can be collapsed' },
        { name: 'defaultExpanded', type: 'boolean', defaultValue: 'false', description: 'Whether expanded by default' },
        { name: 'duration', type: 'number | string', description: 'Elapsed thinking time shown in the header.' },
        { name: 'isStreaming', type: 'boolean', defaultValue: 'false', description: 'Marks reasoning as still arriving.' },
        { name: 'formatTime', type: '(date: Date) => string', description: 'Custom step timestamp formatter.' },
        { name: 'locale', type: 'string', description: 'BCP-47 locale for the default timestamp formatter.' },
        { name: 'labels', type: '{ title?, count?, thinking?, step? }', description: 'Localized header, count and step labels.' },
      ]}
      accessibility={[
        'Uses aria-expanded to communicate collapsible state',
        'Collapsible button is keyboard accessible',
        'Steps are numbered for easy reference',
        'Visual hierarchy with clear step indicators',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
