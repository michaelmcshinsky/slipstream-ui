'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { Input, type InputProps } from '../input/Input';

export type TimePickerProps = Omit<InputProps, 'type' | 'onChange' | 'value' | 'defaultValue'> & {
  /** "HH:MM" (24h) — controlled. */
  value?: string;
  /** "HH:MM" — initial value when uncontrolled. */
  defaultValue?: string;
  /** Fired with the time string ('' when cleared). */
  onValueChange?: (value: string) => void;
  /** Show a clear button once a time is selected. */
  clearable?: boolean;
};

/**
 * Native time field with an "HH:MM" contract. The platform supplies the
 * picker, keyboard editing and locale behavior.
 */
export const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(function TimePicker(
  { value, defaultValue, onValueChange, clearable = false, className, ...props },
  ref
) {
  const [internal, setInternal] = React.useState(defaultValue ?? '');
  const current = value ?? internal;

  const commit = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <div className={cn('relative flex items-center', className)}>
      <Input
        ref={ref}
        type="time"
        value={current}
        onChange={(event) => commit(event.target.value)}
        className={clearable && current ? 'pr-9' : undefined}
        {...props}
      />
      {clearable && current && (
        <button
          type="button"
          onClick={() => commit('')}
          aria-label="Clear time"
          className="absolute right-2 rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          ✕
        </button>
      )}
    </div>
  );
});
