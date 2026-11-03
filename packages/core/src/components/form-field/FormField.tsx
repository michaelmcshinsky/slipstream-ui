'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { Label } from '../label/Label';
import { Tooltip } from '../tooltip/Tooltip';

export type FormFieldLabelPlacement = 'top' | 'left';

export type FormFieldProps = {
  /**
   * The control's id. The same value is applied to the label's htmlFor, the
   * control (via clone), and the hint/error describedby wiring.
   */
  id: string;
  /** Visible label text (screen-reader visible even when labelHidden). */
  label: string;
  /** Helper text rendered under the control and wired via aria-describedby. */
  hint?: string;
  /**
   * Validation error; replaces the hint, sets aria-invalid on the control,
   * announced via role=alert.
   */
  error?: string;
  /** Renders the required marker and (via the cloned control) keeps the native required attribute. */
  required?: boolean;
  /** Keeps the label for assistive tech but hides it visually. */
  labelHidden?: boolean;
  /** Stack the label above the control (default) or inline it to the left. */
  labelPlacement?: FormFieldLabelPlacement;
  /** Info icon rendered after the label; opens a tooltip with this text. */
  tooltip?: string;
  /** Slot pinned to the far right of the label row (badge, link, action). */
  trailing?: React.ReactNode;
  className?: string;
  /**
   * The control. When it is a single React element (Slipstream inputs,
   * native inputs…), id / aria-describedby / aria-invalid are cloned onto
   * it automatically; wrapped or custom children must set them manually.
   */
  children: React.ReactNode;
};

type CloneableProps = Record<string, unknown>;

/**
 * Label + control + hint/error in one unit with the a11y wiring done for
 * you: htmlFor pairing, aria-describedby pointing at the hint (or error),
 * and aria-invalid when an error is present. Supports top or left label
 * placement, a label tooltip with info icon, and a trailing slot on the
 * right of the label row.
 */
const FormField = ({
  id,
  label,
  hint,
  error,
  required,
  labelHidden,
  labelPlacement = 'top',
  tooltip,
  trailing,
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

  const labelNode = (
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
  );

  const tooltipNode = tooltip ? (
    <Tooltip content={tooltip} side="top">
      <button
        type="button"
        aria-label={`${label} information`}
        className="ml-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
          <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM8 7a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 7Zm0-2.25a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z" />
        </svg>
      </button>
    </Tooltip>
  ) : null;

  const hintOrError = error ? (
    <p id={errorId} role="alert" className="text-xs text-destructive">
      {error}
    </p>
  ) : hint ? (
    <p id={hintId} className="text-xs text-muted-foreground">
      {hint}
    </p>
  ) : null;

  if (labelPlacement === 'left') {
    return (
      <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
        <div className="flex items-start gap-3">
          <div className="flex w-40 shrink-0 items-center gap-1 pt-2">
            {labelNode}
            {tooltipNode}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            {/* Trailing sits inline with the control (vertically centered),
                not floating above it — keeps the row reading as one field. */}
            <div className="flex min-w-0 items-center gap-2">
              <div className="min-w-0 flex-1">{control}</div>
              {trailing && (
                <span className="shrink-0 text-xs text-muted-foreground">{trailing}</span>
              )}
            </div>
            {hintOrError}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center">
          {labelNode}
          {tooltipNode}
        </span>
        {trailing}
      </div>
      {control}
      {hintOrError}
    </div>
  );
};
FormField.displayName = 'FormField';

export { FormField };
