'use client';

import { DatePickerPopover, FormField } from '@slipstream-ui/core';
import { useState } from 'react';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function DatePickerPopoverPage() {
  const [date, setDate] = useState('2026-11-13');

  return (
    <ComponentPage
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
      ]}
      accessibility={[
        'The trigger is a button with aria-haspopup="dialog" and aria-expanded.',
        'Enter or Space opens the panel; the selected day receives focus.',
        'Escape closes the panel; choosing a day returns focus to the trigger.',
      ]}
    >
      <DemoCard
        title="Booking date"
        preview={
          <div className="w-full max-w-sm">
            <FormField id="dpp-date" label="Session date" hint="Business-local date">
              <DatePickerPopover
                id="dpp-date"
                value={date}
                onValueChange={setDate}
                today="2026-11-13"
                min="2026-01-01"
                max="2026-12-31"
              />
            </FormField>
            <p className="mt-3 text-sm text-muted-foreground">
              Value posted by a form: <span className="font-medium text-foreground">{date}</span>
            </p>
          </div>
        }
        code={`const [date, setDate] = useState('2026-11-13');

<FormField id="date" label="Session date">
  <DatePickerPopover id="date" name="date" value={date} onValueChange={setDate} />
</FormField>`}
        usage={`// The visible label is localized; read the ISO value, never the trigger text.
// side="top" is useful when the field sits near the bottom of a form; the panel
// flips automatically when there is no room.`}
        types={`type DatePickerPopoverProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  min?: string;
  max?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  placeholder?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
};`}
      />
    </ComponentPage>
  );
}
