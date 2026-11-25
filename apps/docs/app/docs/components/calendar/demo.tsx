'use client';

import { Calendar } from '@slipstream-ui/core';
import { useState } from 'react';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function CalendarPage() {
  const [date, setDate] = useState('2026-11-13');

  return (
    <ComponentPage
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
    </ComponentPage>
  );
}
