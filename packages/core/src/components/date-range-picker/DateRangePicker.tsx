'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../button/Button';
import { DatePicker } from '../date-picker/DatePicker';

export type DateRange = {
  /** ISO date (YYYY-MM-DD) or an empty string. */
  start?: string;
  end?: string;
};

export type DateRangePreset = {
  label: string;
  /** Number of days back from today. */
  days?: number;
  /** Start at January 1 of the current year. */
  ytd?: boolean;
};

export type DateRangePickerProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'value' | 'defaultValue' | 'onChange'> & {
  /** Controlled range. */
  value?: DateRange;
  /** Initial range when uncontrolled. */
  defaultValue?: DateRange;
  /** Fires with the next ISO range. */
  onValueChange?: (range: DateRange) => void;
  /** Accessible label for the start field. Default "From". */
  startLabel?: string;
  /** Accessible label for the end field. Default "To". */
  endLabel?: string;
  /** Preset buttons. Defaults to 7 days, 30 days, 90 days and YTD. */
  presets?: DateRangePreset[];
  /** Show the preset row. Default true. */
  showPresets?: boolean;
  disabled?: boolean;
};

const DEFAULT_PRESETS: DateRangePreset[] = [
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
  { label: 'YTD', ytd: true },
];

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Start/end date range with ISO strings and quick presets. Partial ranges are
 * allowed; when both ends are present the end can never precede the start.
 */
export const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  function DateRangePicker(
    {
      value,
      defaultValue,
      onValueChange,
      startLabel = 'From',
      endLabel = 'To',
      presets = DEFAULT_PRESETS,
      showPresets = true,
      disabled = false,
      className,
      ...props
    },
    ref
  ) {
    const startId = React.useId();
    const endId = React.useId();
    const [internal, setInternal] = React.useState<DateRange>(defaultValue ?? {});
    const current = value ?? internal;

    const commit = (next: DateRange) => {
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
    };

    const setStart = (start: string) => {
      const end = current.end && start && current.end < start ? start : current.end;
      commit({ start, end });
    };

    const setEnd = (end: string) => {
      const start = current.start && end && end < current.start ? end : current.start;
      commit({ start, end });
    };

    const applyPreset = (preset: DateRangePreset) => {
      const end = new Date();
      const start = new Date();
      if (preset.ytd) {
        start.setMonth(0, 1);
      } else {
        start.setDate(start.getDate() - Math.max(0, (preset.days ?? 1) - 1));
      }
      commit({ start: toIsoDate(start), end: toIsoDate(end) });
    };

    return (
      <div ref={ref} className={cn('flex flex-col gap-3', className)} {...props}>
        {showPresets && presets.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset)}
                disabled={disabled}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={startId} className="mb-1 block text-xs font-medium text-muted-foreground">
              {startLabel}
            </label>
            <DatePicker
              id={startId}
              value={current.start ?? ''}
              onValueChange={setStart}
              max={current.end || undefined}
              disabled={disabled}
              clearable
            />
          </div>
          <div>
            <label htmlFor={endId} className="mb-1 block text-xs font-medium text-muted-foreground">
              {endLabel}
            </label>
            <DatePicker
              id={endId}
              value={current.end ?? ''}
              onValueChange={setEnd}
              min={current.start || undefined}
              disabled={disabled}
              clearable
            />
          </div>
        </div>
      </div>
    );
  }
);
