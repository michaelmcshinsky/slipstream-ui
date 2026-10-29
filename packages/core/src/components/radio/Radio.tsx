'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** Controlled checked state; omit for uncontrolled usage. */
  checked?: boolean;
  /** Fired when the user selects this radio. */
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * Accessible radio built on the native input, to be used inside a
 * `RadioGroup` (which provides the shared `name`). Platform keyboard
 * navigation and form semantics come for free.
 */
const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => (
    <input
      type="radio"
      ref={ref}
      checked={checked}
      onChange={(event) => onCheckedChange?.(event.target.checked)}
      className={cn(
        'h-4 w-4 shrink-0 rounded-full border border-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'checked:bg-primary checked:text-primary-foreground',
        className
      )}
      {...props}
    />
  )
);
Radio.displayName = 'Radio';

export interface RadioGroupProps {
  /** Shared name applied to every radio in the group. */
  name: string;
  /** Accessible group label; rendered as <legend> inside a fieldset. */
  legend?: string;
  /** Currently selected value (controlled). */
  value?: string;
  /** Initial value (uncontrolled). */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

/**
 * Groups related radios with a shared name and accessible legend.
 * Renders a native <fieldset>/<legend> so screen readers announce the
 * group context alongside each option.
 */
const RadioGroup = React.forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  ({ name, legend, value, defaultValue, onValueChange, className, children }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
    const currentValue = value ?? internalValue;

    const handleChange = (next: string) => {
      if (value === undefined) setInternalValue(next);
      onValueChange?.(next);
    };

    return (
      <fieldset ref={ref} className={cn('space-y-2', className)}>
        {legend && <legend className="text-sm font-medium">{legend}</legend>}
        <RadioGroupContext.Provider value={{ name, value: currentValue, onChange: handleChange }}>
          {children}
        </RadioGroupContext.Provider>
      </fieldset>
    );
  }
);
RadioGroup.displayName = 'RadioGroup';

type RadioGroupContextValue = {
  name: string;
  value: string;
  onChange: (value: string) => void;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue>({
  name: '',
  value: '',
  onChange: () => {},
});

export interface RadioGroupItemProps extends Omit<RadioProps, 'name' | 'checked' | 'onCheckedChange' | 'value'> {
  /** The value this item contributes to the group. */
  value: string;
  /** Visible label rendered next to the radio. */
  label?: string;
}

/** A single radio option inside a `RadioGroup`. */
const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ value, label, className, id, ...props }, ref) => {
    const group = React.useContext(RadioGroupContext);
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex items-center gap-2">
        <Radio
          ref={ref}
          id={inputId}
          name={group.name}
          value={value}
          checked={group.value === value}
          onCheckedChange={(checked) => checked && group.onChange(value)}
          className={className}
          {...props}
        />
        {label && (
          <label htmlFor={inputId} className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
      </div>
    );
  }
);
RadioGroupItem.displayName = 'RadioGroupItem';

export { Radio, RadioGroup, RadioGroupItem };
