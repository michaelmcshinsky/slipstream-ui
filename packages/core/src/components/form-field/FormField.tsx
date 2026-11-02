'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { Label } from '../label/Label';

export interface FormFieldProps {
  /**
   * The control's id. The same value is applied to the label's htmlFor, the
   * control (via clone), and the hint/error describedby wiring.
   */
  id: string;
  /** Visible label text (screen-reader visible even when labelHidden). */
  label: string;
  /** Helper text rendered under the control and wired via aria-describedby. */
  hint?: string;
  /** Validation error; replaces the hint, sets aria-invalid on the control, announced via role=alert. */
  error?: string;
  /** Renders the required marker and (via the cloned control) keeps the native required attribute. */
  required?: boolean;
  /** Keeps the label for assistive tech but hides it visually. */
  labelHidden?: boolean;
  className?: string;
  /**
   * The control. When it is a single React element (Slipstream inputs,
   * native inputs…), id / aria-describedby / aria-invalid are cloned onto
   * it automatically; wrapped or custom children must set them manually.
   */
  children: React.ReactNode;
}

type CloneableProps = Record<string, unknown>;

/**
 * Label + control + hint/error in one unit with the a11y wiring done for
 * you: htmlFor pairing, aria-describedby pointing at the hint (or error),
 * and aria-invalid when an error is present. Keeps label-to-control
 * spacing tight and consistent (gap-1.5).
 */
const FormField = ({
  id,
  label,
  hint,
  error,
  required,
  labelHidden,
  className,
  children,
}: FormFieldProps) => {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  let control = children;
  // Fragments/multi-children can't receive wired props — consumers must set
  // id/aria-describedby on those children themselves (documented).
  if (React.isValidElement<CloneableProps>(children) && children.type !== React.Fragment) {
    control = React.cloneElement<CloneableProps>(children, {
      id,
      'aria-describedby': describedBy,
      ...(error ? { 'aria-invalid': true } : {}),
    });
  }

  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <Label htmlFor={id} className={labelHidden ? 'sr-only' : undefined}>
        {label}
        {required && (
          <>
            {' '}
            <span aria-hidden="true" className="ml-0.5 text-destructive">
              *
            </span>
          </>
        )}
      </Label>
      {control}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )
      )}
    </div>
  );
};
FormField.displayName = 'FormField';

export { FormField };
