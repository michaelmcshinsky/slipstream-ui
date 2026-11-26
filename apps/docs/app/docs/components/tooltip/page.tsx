import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/tooltip', {
  title: "Tooltip",
  description: "Hover/focus tooltip with aria-describedby association and Escape dismissal.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('tooltip')}
      id="tooltip"
      title="Tooltip"
      description="Hover/focus tooltip with aria-describedby association and Escape dismissal."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'content', type: 'string', description: 'The tooltip text.' },
        { name: 'side', type: "'top' | 'bottom' | 'left' | 'right'", defaultValue: "'top'", description: 'Placement relative to the trigger.' },
        { name: 'delay', type: 'number', defaultValue: '300', description: 'Delay before showing on hover, in ms. Use 0 for instant hints.' },
        { name: 'variant', type: "'default' | 'inverse'", defaultValue: "'default'", description: 'Bubble palette; inverse is dark in light mode and light in dark mode.' },
        { name: 'children', type: 'ReactElement', description: 'Exactly one trigger element (button, input, icon…).' },
        { name: 'className', type: 'string', description: 'Extra classes for the tooltip bubble.' },
      ]}
      accessibility={[
        'aria-describedby is injected into the trigger so the hint is announced with focus.',
        'Escape dismisses the tooltip without moving focus.',
        'The tooltip also shows on keyboard focus: never hide essential information in hover-only UI.',
        'Tooltips are supplementary: keep the trigger itself labeled (aria-label or visible text).',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
