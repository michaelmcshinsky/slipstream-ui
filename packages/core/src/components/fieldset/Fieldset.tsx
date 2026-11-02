import * as React from 'react';
import { cn } from '../../utils/cn';

export interface FieldsetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  /** Legend rendered as the group's accessible name. */
  legend?: string;
  /** Muted supporting line rendered under the legend. */
  description?: string;
  /** Error line rendered under the controls; announced via role=alert. */
  error?: string;
}

/**
 * Groups related form controls in a native <fieldset> with a legend,
 * optional description, and an error slot. Styling is token-based
 * (borderless by default — the native border reads as chrome, not content).
 */
const Fieldset = React.forwardRef<HTMLFieldSetElement, FieldsetProps>(
  ({ legend, description, error, className, children, ...props }, ref) => (
    <fieldset
      ref={ref}
      className={cn('m-0 flex min-w-0 flex-col gap-1.5 border-0 p-0', className)}
      {...props}
    >
      {legend && <legend className="p-0 text-sm font-medium leading-none">{legend}</legend>}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {children}
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  )
);
Fieldset.displayName = 'Fieldset';

export { Fieldset };
