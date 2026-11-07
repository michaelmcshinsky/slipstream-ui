'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { Input, type InputProps } from '../input/Input';

export type DatePickerProps = Omit<InputProps, 'type' | 'value' | 'defaultValue'> & {
  /** ISO date string (YYYY-MM-DD) — controlled. */
  value?: string;
  /** ISO date string — initial value when uncontrolled. */
  defaultValue?: string;
  /** Fired with the ISO string ('' when cleared). */
  onValueChange?: (value: string) => void;
  /** Show a clear button once a date is selected. */
  clearable?: boolean;
};

/**
 * Native date field with an ISO-string contract. Uses the platform picker
 * (mobile date wheels, keyboard editing, locale formatting) rather than a
 * custom calendar, so accessibility and input methods come for free.
 */
export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
  { value, defaultValue, onValueChange, onChange, clearable = false, className, ...props },
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
        type="date"
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
          aria-label="Clear date"
          className="absolute right-2 rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          ✕
        </button>
      )}
    </div>
  );
});
