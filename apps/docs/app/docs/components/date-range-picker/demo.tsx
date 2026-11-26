'use client';

import { useState } from 'react';
import { DateRangePicker, type DateRange } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  const [range, setRange] = useState<DateRange>({ start: '2026-01-01', end: '2026-03-31' });

  return (
    <>
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
    </>
  );
}
