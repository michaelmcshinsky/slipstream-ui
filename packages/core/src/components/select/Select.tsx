'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value' | 'defaultValue'> {
  options: SelectOption[];
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

/**
 * Accessible select primitive built on the native <select>: full keyboard,
 * screen-reader and mobile platform behavior comes from the platform rather
 * than a re-implemented listbox (KC-030). Controlled via `value`, or
 * uncontrolled via `defaultValue`.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, label, value, defaultValue, onChange, id, className, ...props },
  ref,
) {
  const generatedId = React.useId();
  const selectId = id ?? generatedId;
  const labelId = `${selectId}-label`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label id={labelId} htmlFor={selectId} className="text-sm font-medium">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        aria-labelledby={label ? labelId : undefined}
        className={cn(
          'rounded-md border border-input bg-background px-3 py-2 text-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          className
        )}
        value={value}
        defaultValue={defaultValue}
        onChange={(event) => onChange?.(event.target.value)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});
