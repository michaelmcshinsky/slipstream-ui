'use client';

import { FormField, TimePicker } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
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
// Pair with DatePicker for scheduling UIs.
// Rendering is native input[type=time]: the browser/OS controls the picker
// UI and 12h vs 24h display follows the user's locale — don't parse the
// visible text, only the emitted "HH:MM" value.`}
        types={`type TimePickerProps = Omit<InputProps, 'type' | 'value' | 'defaultValue'> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  clearable?: boolean;
  clearLabel?: string;
};`}
      />
    </>
  );
}
