'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { Input, type InputProps } from '../input/Input';

export type TimePickerProps = Omit<InputProps, 'type' | 'value' | 'defaultValue'> & {
  /** "HH:MM" (24h) — controlled. */
  value?: string;
  /** "HH:MM" — initial value when uncontrolled. */
  defaultValue?: string;
  /** Fired with the time string ('' when cleared). */
  onValueChange?: (value: string) => void;
  /** Show a clear button once a time is selected. */
  clearable?: boolean;
  /** Accessible label for the clear button. Default 'Clear time'. */
  clearLabel?: string;
};

/**
 * Native time field with an "HH:MM" contract. The platform supplies the
 * picker, keyboard editing and locale behavior.
 */
export const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(function TimePicker(
  { value, defaultValue, onValueChange, onChange, clearable = false, clearLabel = 'Clear time', className, ...props },
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
        onChange={(event) => {
          commit(event.target.value);
          onChange?.(event);
        }}
        className={clearable && current ? 'pr-9' : undefined}
        {...props}
      />
      {clearable && current && (
        <button
          type="button"
          onClick={() => commit('')}
          aria-label={clearLabel}
          className="absolute right-1.5 inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          ✕
        </button>
      )}
    </div>
  );
});
