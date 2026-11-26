import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/date-range-picker', {
  title: 'DateRangePicker',
  description: 'Start/end date range with ISO strings and quick presets.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('date-range-picker')}
      id="date-range-picker"
      title="DateRangePicker"
      description="Start/end date range with ISO strings and quick presets."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'value', type: 'DateRange', description: 'Controlled range with ISO start/end strings.' },
        { name: 'defaultValue', type: 'DateRange', description: 'Initial range when uncontrolled.' },
        { name: 'onValueChange', type: '(range: DateRange) => void', description: 'Fires with the next ISO range.' },
        { name: 'startLabel', type: 'string', defaultValue: "'From'", description: 'Accessible label for the start field.' },
        { name: 'endLabel', type: 'string', defaultValue: "'To'", description: 'Accessible label for the end field.' },
        { name: 'presets', type: 'DateRangePreset[]', description: 'Preset buttons. Defaults to 7/30/90 days and YTD. Windows compute against the browser-local today.' },
        { name: 'showPresets', type: 'boolean', defaultValue: 'true', description: 'Show the preset row.' },
        { name: 'disabled', type: 'boolean', description: 'Disable presets and both fields.' },
      ]}
      accessibility={[
        'Both native date inputs have visible associated labels.',
        'The end cannot precede the start; the range stays ordered.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
