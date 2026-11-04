'use client';

import { DatePicker, FormField } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function DatePickerPage() {
  return (
    <ComponentPage
      id="date-picker"
      title="DatePicker"
      description="Native date field with an ISO-string contract, min/max passthrough and an optional clear button."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'value', type: 'string', description: 'ISO date (YYYY-MM-DD), controlled.' },
        { name: 'defaultValue', type: 'string', description: 'ISO date, initial value.' },
        { name: 'onValueChange', type: '(value: string) => void', description: "Fired with the ISO string; '' when cleared." },
        { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Shows a clear button once a value exists.' },
        { name: '…InputProps', type: 'InputProps', description: 'min, max, name, required, disabled all pass through.' },
      ]}
      accessibility={['Renders input[type=date] so OS pickers, keyboard editing and locale formatting apply.', 'Always label the field (FormField or aria-label).']}
    >
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
        types={`type DatePickerProps = Omit<InputProps, 'type' | 'onChange' | 'value' | 'defaultValue'> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  clearable?: boolean;
};`}
      />
    </ComponentPage>
  );
}
