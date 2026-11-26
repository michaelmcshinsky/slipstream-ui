'use client';

import { DatePicker, FormField } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="ISO date field"
        preview={
          <div className="w-full max-w-sm">
            <FormField id="dp-start" label="Start date" hint="Stored as YYYY-MM-DD">
              <DatePicker clearable defaultValue="2026-11-03" />
            </FormField>
          </div>
        }
        code={`<FormField id="start" label="Start date">
  <DatePicker value={start} onValueChange={setStart} clearable min="2026-01-01" />
</FormField>`}
        usage={`// The platform supplies the picker; keep state as an ISO string and format
// for display at the edge (Intl.DateTimeFormat).`}
        types={`type DatePickerProps = Omit<InputProps, 'type' | 'value' | 'defaultValue'> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  clearable?: boolean;
  clearLabel?: string;
  // onChange and every other InputProps attribute pass through to the
  // underlying <input type="date">.
};`}
      />
    </>
  );
}
