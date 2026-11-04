import * as React from 'react';
import { cn } from '../../utils/cn';
import { resolveGap, type GapValue } from '../../utils/gap';

export type FormVariant = 'default' | 'card' | 'inline';

export type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  /** Visual container: plain stack (default), bordered card, or inline row. */
  variant?: FormVariant;
  /** Even spacing between children — token ('md') or exact pixels (16). */
  gap?: GapValue;
};

/**
 * Semantic <form> with an even-spacing layout built in: children stack
 * vertically (default), render as a bordered card, or flow inline on one
 * row. Native submit/validation semantics are untouched — wire onSubmit
 * and use noValidate only when you validate manually (e.g. with FormField
 * error states).
 */
const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ variant = 'default', gap, className, style, ...props }, ref) => {
    const gapResolved = resolveGap(gap ?? 'md');
    return (
      <form
        ref={ref}
        className={cn(
          'flex min-w-0 flex-col',
          variant === 'card' && 'rounded-lg border border-border bg-card p-6',
          variant === 'inline' && 'flex-row flex-wrap items-end',
          gapResolved.className,
          className
        )}
        style={{ ...gapResolved.style, ...style }}
        {...props}
      />
    );
  }
);
Form.displayName = 'Form';

export { Form };
