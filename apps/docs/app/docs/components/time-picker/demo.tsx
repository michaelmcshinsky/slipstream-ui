'use client';

import { FormField, TimePicker } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function TimePickerPage() {
  return (
    <ComponentPage
      id="time-picker"
      title="TimePicker"
      description="Native time field with an HH:MM contract and an optional clear button."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'value', type: 'string', description: '"HH:MM" (24h), controlled.' },
        { name: 'defaultValue', type: 'string', description: '"HH:MM", initial value.' },
        { name: 'onValueChange', type: '(value: string) => void', description: "Fired with the time string; '' when cleared." },
        { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Shows a clear button once a value exists.' },
      ]}
      accessibility={['Renders input[type=time]; the OS picker and keyboard editing apply.', 'Label the moment, not the control type.']}
    >
      <DemoCard
        title="Class time"
        preview={
          <div className="w-full max-w-sm">
            <FormField id="tp-start" label="Starts at" hint="24-hour, HH:MM">
              <TimePicker clearable defaultValue="18:30" />
            </FormField>
          </div>
        }
        code={`<FormField id="start" label="Starts at">
  <TimePicker value={start} onValueChange={setStart} clearable />
</FormField>`}
        usage={`// State stays "HH:MM"; format for display with Intl.DateTimeFormat.
// Pair with DatePicker for scheduling UIs.`}
        types={`type TimePickerProps = Omit<InputProps, 'type' | 'onChange' | 'value' | 'defaultValue'> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  clearable?: boolean;
};`}
      />
    </ComponentPage>
  );
}
