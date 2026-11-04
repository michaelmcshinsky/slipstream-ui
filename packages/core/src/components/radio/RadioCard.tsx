'use client';

import * as React from 'react';
import { Radio, RadioGroupContext } from './Radio';
import { cn } from '../../utils/cn';

export type RadioCardProps = {
  /** The value this section contributes to the group. */
  value: string;
  /** Section heading. */
  title?: string;
  /** Supporting line under the title. */
  description?: string;
  /** Custom body rendered after title/description. */
  children?: React.ReactNode;
  /** Outer border radius on the section (default true). */
  rounded?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
};

/**
 * A whole section as one radio option: the entire card is the label,
 * the native radio circle is visually hidden (kept for semantics and
 * keyboard use), and selection shows as a primary border + tint via
 * has-[:checked]. Meant to sit inside a `RadioGroup`.
 */
const RadioCard = React.forwardRef<HTMLLabelElement, RadioCardProps>(
  ({ value, title, description, children, rounded = true, disabled, className, id }, ref) => {
    const group = React.useContext(RadioGroupContext);
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <label
        ref={ref}
        htmlFor={inputId}
        className={cn(
          'flex cursor-pointer flex-col gap-1.5 border border-border p-4 transition-colors',
          rounded ? 'rounded-lg' : 'rounded-none',
          'hover:border-muted-foreground/40 hover:bg-muted/30',
          // Selected state rides on the hidden input — no visible circle.
          'has-[:checked]:border-primary has-[:checked]:bg-primary/5',
          'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background',
          disabled && 'cursor-not-allowed opacity-50 hover:border-border hover:bg-transparent',
          className
        )}
      >
        <Radio
          id={inputId}
          value={value}
          checked={group.value === value}
          onCheckedChange={(checked) => checked && group.onChange(value)}
          disabled={disabled}
          className="sr-only"
        />
        {title && <span className="text-sm font-medium leading-none">{title}</span>}
        {description && <span className="text-sm text-muted-foreground">{description}</span>}
        {children}
      </label>
    );
  }
);
RadioCard.displayName = 'RadioCard';

export { RadioCard };
