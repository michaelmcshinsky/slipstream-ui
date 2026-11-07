'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectOptionGroup = {
  label: string;
  options: SelectOption[];
};

export type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'value' | 'defaultValue' | 'multiple'
> & {
  /** Flat options. Ignored when `groups` is provided. */
  options?: SelectOption[];
  /** Optgroups with a heading per section. */
  groups?: SelectOptionGroup[];
  label?: string;
  /** Renders a disabled empty option — the native "choose one" affordance. */
  placeholder?: string;
  /** Native multi-select: value/onChange switch to string[]. */
  multiple?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  /** Native change event - compatible with react-hook-form's register(). */
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  /** Value-based callback for controlled usage. */
  onValueChange?: (value: string | string[]) => void;
};

/**
 * Accessible select primitive built on the native <select>: full keyboard,
 * screen-reader and mobile platform behavior comes from the platform rather
 * than a re-implemented listbox. Supports flat options, optgroups,
 * placeholder rows and native multi-select (string[] contract).
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, groups, label, placeholder, multiple = false, value, defaultValue, onChange, onValueChange, id, className, ...props },
  ref,
) {
  const generatedId = React.useId();
  const selectId = id ?? generatedId;
  const labelId = `${selectId}-label`;

  const renderOption = (option: SelectOption) => (
    <option key={option.value} value={option.value} disabled={option.disabled}>
      {option.label}
    </option>
  );

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
        multiple={multiple}
        aria-labelledby={label ? labelId : undefined}
        className={cn(
          'rounded-md border border-input bg-background px-3 py-2 text-sm',
          multiple && 'min-h-32',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20',
          className
        )}
        value={value as string | string[] | undefined}
        defaultValue={defaultValue as string | string[] | undefined}
        onChange={(event) => {
          const next = multiple
            ? Array.from(event.target.selectedOptions, (option) => option.value)
            : event.target.value;
          onChange?.(event);
          onValueChange?.(next);
        }}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {groups
          ? groups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map(renderOption)}
              </optgroup>
            ))
          : (options ?? []).map(renderOption)}
      </select>
    </div>
  );
});
