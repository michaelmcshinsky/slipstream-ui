'use client';

import { Calendar } from '@slipstream-ui/core';
import { useState } from 'react';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  const [date, setDate] = useState('2026-11-13');

  return (
    <>
      <DemoCard
        title="Month grid"
        preview={
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-border p-3">
              <Calendar value={date} onValueChange={setDate} today="2026-11-13" autoFocus />
            </div>
            <p className="text-sm text-muted-foreground">
              Selected: <span className="font-medium text-foreground">{date}</span>
            </p>
          </div>
        }
        code={`const [date, setDate] = useState('2026-11-13');

<Calendar value={date} onValueChange={setDate} min="2026-01-01" max="2026-12-31" />`}
        usage={`// The value is an ISO key, so a browser in another timezone cannot shift the day.
// Format for display with Intl.DateTimeFormat and timeZone: 'UTC'.
// Use isDateDisabled for holidays; keep the cells visible so the grid stays stable.`}
        types={`type CalendarProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  min?: string;
  max?: string;
  today?: string;
  locale?: string;
  weekStartsOn?: 0 | 1;
  isDateDisabled?: (value: string) => boolean;
  showOutsideDays?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
};`}
      />
    </>
  );
}
