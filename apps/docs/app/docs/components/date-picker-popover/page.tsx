import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/date-picker-popover', {
  title: 'DatePickerPopover',
  description: 'Date field with a Calendar panel, ISO strings, min/max and keyboard selection.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('date-picker-popover')}
      id="date-picker-popover"
      title="DatePickerPopover"
      description="Date field with a Calendar panel, ISO strings, min/max and keyboard selection."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'value', type: 'string', description: 'Selected day as `YYYY-MM-DD`.' },
        { name: 'onValueChange', type: '(value: string) => void', description: 'Fired with the ISO key.' },
        { name: 'min / max', type: 'string', description: 'Selectable bounds, inclusive.' },
        { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", defaultValue: 'bottom', description: 'Preferred side; flips when it cannot fit.' },
        { name: 'placeholder', type: 'string', defaultValue: 'Pick a date', description: 'Trigger text before a date is chosen.' },
        { name: 'name / required', type: 'string / boolean', description: 'Hidden input for native forms.' },
        { name: 'disabled', type: 'boolean', description: 'Disables the trigger.' },
        { name: 'today', type: 'string', description: 'Override "today" (YYYY-MM-DD) for deterministic rendering/tests.' },
        { name: 'locale', type: 'string', defaultValue: "'en-US'", description: 'Locale for month/weekday names.' },
        { name: 'weekStartsOn', type: '0 | 1', defaultValue: '0', description: 'First weekday column: 0 = Sunday, 1 = Monday.' },
        { name: 'id / aria-label', type: 'string', description: 'Trigger id and accessible name; pair with FormField label.' },
      ]}
      accessibility={[
        'The trigger is a button with aria-haspopup="dialog" and aria-expanded.',
        'Enter or Space opens the panel; the selected day receives focus.',
        'Escape closes the panel; choosing a day returns focus to the trigger.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
