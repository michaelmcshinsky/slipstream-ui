import * as React from 'react';
import { cn } from '../../utils/cn';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** Controlled checked state; omit for uncontrolled usage. */
  checked?: boolean;
  /** Fired when the user toggles the checkbox. */
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * Accessible checkbox built on the native input: keyboard, form, and
 * screen-reader behavior comes from the platform. Visual state is drawn
 * with a CSS overlay so the native input stays the source of truth.
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => (
    <input
      type="checkbox"
      ref={ref}
      checked={checked}
      onChange={(event) => onCheckedChange?.(event.target.checked)}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'checked:bg-primary checked:text-primary-foreground',
        className
      )}
      {...props}
    />
  )
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
