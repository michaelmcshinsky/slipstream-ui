import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/calendar', {
  title: 'Calendar',
  description: 'Month grid with ISO date keys, min/max bounds and full keyboard navigation.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('calendar')}
      id="calendar"
      title="Calendar"
      description="Month grid with ISO date keys, min/max bounds and full keyboard navigation."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'value', type: 'string', description: 'Selected day as `YYYY-MM-DD` (controlled).' },
        { name: 'defaultValue', type: 'string', description: 'Initial day when uncontrolled.' },
        { name: 'onValueChange', type: '(value: string) => void', description: 'Fired with the ISO key.' },
        { name: 'min / max', type: 'string', description: 'Selectable bounds, inclusive.' },
        { name: 'weekStartsOn', type: '0 | 1', defaultValue: '0', description: 'Sunday or Monday first.' },
        { name: 'locale', type: 'string', defaultValue: "'en-US'", description: 'BCP-47 locale for month and weekday labels.' },
        { name: 'showOutsideDays', type: 'boolean', defaultValue: 'true', description: 'Render trailing/leading days from adjacent months.' },
        { name: 'isDateDisabled', type: '(value: string) => boolean', description: 'Block individual days.' },
        { name: 'autoFocus', type: 'boolean', defaultValue: 'false', description: 'Focus the active day on mount.' },
        { name: 'disabled', type: 'boolean', description: 'Disables the grid and month controls.' },
      ]}
      accessibility={[
        'role=grid with rows, columnheaders and gridcells; the month label is announced politely.',
        'Arrow keys move by day or week, Home/End jump to the week bounds, PageUp/PageDown change month, Enter selects.',
        'One tab stop: roving tabindex keeps the grid compact for keyboard users.',
        'Today uses aria-current="date"; selection uses aria-selected on the cell.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
