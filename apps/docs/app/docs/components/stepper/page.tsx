import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

const PROPS_ROWS = [
  { name: 'steps', type: '{ label: string; description?: string }[]', defaultValue: 'required', description: 'Ordered step definitions.' },
  { name: 'current', type: 'number', defaultValue: 'required', description: 'Zero-based index of the active step.' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: 'Layout direction.' },
  { name: 'variant', type: "'numbered' | 'dots'", defaultValue: "'numbered'", description: 'Numbered markers with a check when complete, or compact dots.' },
  { name: 'size', type: "'sm' | 'md'", defaultValue: "'md'", description: 'Marker and label scale.' },
  { name: 'labelPlacement', type: "'inline' | 'below'", defaultValue: "'inline'", description: 'Horizontal only: label beside or beneath the marker.' },
  { name: 'alignTitles', type: "'start' | 'center'", defaultValue: "'center'", description: 'Center a title against its marker when the step has no description.' },
  { name: 'onStepClick', type: '(index: number) => void', description: 'Makes steps clickable (revisit flows).' },
  { name: 'labels', type: '{ completed?: string; current?: string; upcoming?: string }', description: 'Screen-reader state suffixes per step; override the English defaults for localization.' },
];

export const metadata: Metadata = withSeo('/docs/components/stepper', {
  title: 'Stepper',
  description:
    'Multi-step flow indicator with horizontal, labels-below, vertical, and compact dots layouts, aria-current state, and centered titles when no description is present.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('stepper')}
      id="stepper"
      title="Stepper"
      description="Multi-step flow indicator: ordered list, aria-current step, text state, horizontal or vertical, numbered or dots."
      npmPackages="@slipstream-ui/core"
      propsRows={PROPS_ROWS}
      accessibility={[
        'Ordered list semantics; the active step carries aria-current="step".',
        'Complete/current/upcoming are stated in screen-reader text, not only color.',
        'Titles without a description are centred against the marker; titles with one stay top aligned.',
        'Clickable steps are real buttons with a visible focus ring.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
