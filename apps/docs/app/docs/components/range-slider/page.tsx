import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/range-slider', {
  title: 'RangeSlider',
  description: 'Dual-thumb numeric range slider with labeled native inputs and formatted values.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('range-slider')}
      id="range-slider"
      title="RangeSlider"
      description="Dual-thumb numeric range slider with labeled native inputs and formatted values."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'value', type: '[number, number]', description: 'Controlled low/high pair.' },
        { name: 'defaultValue', type: '[number, number]', description: 'Initial low/high pair when uncontrolled. Defaults to [min, max].' },
        { name: 'onValueChange', type: '(value: [number, number]) => void', description: 'Fires with the next low/high pair.' },
        { name: 'min', type: 'number', defaultValue: '0', description: 'Lower bound.' },
        { name: 'max', type: 'number', defaultValue: '100', description: 'Upper bound.' },
        { name: 'step', type: 'number', defaultValue: '1', description: 'Increment.' },
        { name: 'startLabel', type: 'string', defaultValue: "'Minimum'", description: 'Accessible label for the low thumb.' },
        { name: 'endLabel', type: 'string', defaultValue: "'Maximum'", description: 'Accessible label for the high thumb.' },
        { name: 'formatValue', type: '(value: number) => string', description: 'Formats the displayed values and aria-valuetext.' },
        { name: 'showValues', type: 'boolean', defaultValue: 'true', description: 'Show the current low/high values above the track.' },
        { name: 'disabled', type: 'boolean', description: 'Disable both thumbs.' },
      ]}
      accessibility={[
        'Uses two native range inputs, each with its own label and aria-valuetext.',
        'The low thumb cannot cross the high thumb, so the pair always stays ordered.',
        'Both thumbs are centred on the track in WebKit and Firefox, so the grab target matches the visual line.',
      ]}
      browserNotes={[
        'The track is 4px tall and the thumb is 16px. WebKit positions the thumb from the track top, so the component applies a -6px offset to centre it; Firefox centres it natively.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
