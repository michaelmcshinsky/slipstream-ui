'use client';

import * as React from 'react';
import { Checkbox } from '../checkbox/Checkbox';
import { cn } from '../../utils/cn';

export type CheckboxGroupOrientation = 'vertical' | 'horizontal';

export type CheckboxGroupProps = {
  /** Shared name applied to every checkbox in the group. */
  name: string;
  /** Accessible group label; rendered as <legend> inside a fieldset. */
  legend?: string;
  /** Currently selected values (controlled). */
  value?: string[];
  /** Initial values (uncontrolled). */
  defaultValue?: string[];
  /** Called with the full selection after a toggle. */
  onValueChange?: (value: string[]) => void;
  /** Stack options (default) or lay them out in a wrapping row. */
  orientation?: CheckboxGroupOrientation;
  /** Group-level validation message; announced via role=alert. */
  error?: string;
  className?: string;
  children: React.ReactNode;
};

type CheckboxGroupContextValue = {
  name: string;
  values: string[];
  toggle: (value: string) => void;
};

const CheckboxGroupContext = React.createContext<CheckboxGroupContextValue>({
  name: '',
  values: [],
  toggle: () => {},
});

/**
 * Groups related checkboxes with a shared name and accessible legend.
 * Multi-select counterpart of RadioGroup: renders a native
 * <fieldset>/<legend> so screen readers announce the group context,
 * and keeps the selection as a string[] for forms and URLs.
 */
const CheckboxGroup = React.forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(
  (
    { name, legend, value, defaultValue, onValueChange, orientation = 'vertical', error, className, children },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue ?? []);
    const currentValue = value ?? internalValue;

    const toggle = (next: string) => {
      const updated = currentValue.includes(next)
        ? currentValue.filter((item) => item !== next)
        : [...currentValue, next];
      if (value === undefined) setInternalValue(updated);
      onValueChange?.(updated);
    };

    return (
      <fieldset ref={ref} className={cn(orientation === 'vertical' ? 'space-y-2' : 'flex flex-row flex-wrap gap-x-4 gap-y-2', className)}>
        {legend && <legend className="text-sm font-medium">{legend}</legend>}
        <CheckboxGroupContext.Provider value={{ name, values: currentValue, toggle }}>
          {children}
        </CheckboxGroupContext.Provider>
        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
      </fieldset>
    );
  }
);
CheckboxGroup.displayName = 'CheckboxGroup';

export type CheckboxGroupItemProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'name' | 'checked' | 'onChange' | 'value'
> & {
  /** The value this item contributes to the selection. */
  value: string;
  /** Visible label rendered next to the checkbox. */
  label?: string;
};

/** A single multi-select option inside a `CheckboxGroup`. */
const CheckboxGroupItem = React.forwardRef<HTMLInputElement, CheckboxGroupItemProps>(
  ({ value, label, className, id, ...props }, ref) => {
    const group = React.useContext(CheckboxGroupContext);
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex items-center gap-2">
        <Checkbox
          ref={ref}
          id={inputId}
          name={group.name}
          value={value}
          checked={group.values.includes(value)}
          onCheckedChange={() => group.toggle(value)}
          className={className}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
CheckboxGroupItem.displayName = 'CheckboxGroupItem';

export { CheckboxGroup, CheckboxGroupItem };
