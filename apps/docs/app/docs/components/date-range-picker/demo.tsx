'use client';

import { useState } from 'react';
import { DateRangePicker, type DateRange } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function DateRangePickerPage() {
  const [range, setRange] = useState<DateRange>({ start: '2026-01-01', end: '2026-03-31' });

  return (
    <ComponentPage
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
        { name: 'presets', type: 'DateRangePreset[]', description: 'Preset buttons. Defaults to 7/30/90 days and YTD.' },
        { name: 'showPresets', type: 'boolean', defaultValue: 'true', description: 'Show the preset row.' },
        { name: 'disabled', type: 'boolean', description: 'Disable presets and both fields.' },
      ]}
      accessibility={[
        'Both native date inputs have visible associated labels.',
        'The end cannot precede the start; the range stays ordered.',
      ]}
    >
      <DemoCard
        title="Rolling period"
        preview={
          <div className="w-full max-w-md">
            <DateRangePicker value={range} onValueChange={setRange} />
            <p className="mt-3 text-sm text-muted-foreground">
              {range.start || 'Any start'} to {range.end || 'Any end'}
            </p>
          </div>
        }
        code={`<DateRangePicker
  value={range}
  onValueChange={setRange}
  presets={[
    { label: '7 days', days: 7 },
    { label: 'YTD', ytd: true },
  ]}
/>`}
        usage={`// The value contract is ISO strings: { start?: 'YYYY-MM-DD', end?: 'YYYY-MM-DD' }.
// Partial ranges are allowed; presets fill both ends.`}
        types={`type DateRange = {
  start?: string;
  end?: string;
};

type DateRangePreset = {
  label: string;
  days?: number;
  ytd?: boolean;
};

type DateRangePickerProps = {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange) => void;
  startLabel?: string;
  endLabel?: string;
  presets?: DateRangePreset[];
  showPresets?: boolean;
  disabled?: boolean;
};`}
      />
    </ComponentPage>
  );
}
