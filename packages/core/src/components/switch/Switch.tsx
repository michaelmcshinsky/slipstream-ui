'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Controlled on/off state. */
  checked?: boolean;
  /** Initial state when uncontrolled. */
  defaultChecked?: boolean;
  /** Fired when the user toggles the switch. */
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * Toggle switch for binary settings. Rendered as a button with
 * `role="switch"` and `aria-checked`, so screen readers announce
 * on/off state and keyboard users toggle with Enter or Space.
 */
const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, defaultChecked, onCheckedChange, disabled, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
    const isOn = checked ?? internalChecked;

    const toggle = () => {
      if (checked === undefined) setInternalChecked((prev) => !prev);
      onCheckedChange?.(!isOn);
    };

    return (
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        ref={ref}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:cursor-not-allowed disabled:opacity-50',
          isOn ? 'bg-primary' : 'bg-input',
          className
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg transition-transform',
            isOn ? 'translate-x-4' : 'translate-x-0'
          )}
        />
      </button>
    );
  }
);
Switch.displayName = 'Switch';

export { Switch };
