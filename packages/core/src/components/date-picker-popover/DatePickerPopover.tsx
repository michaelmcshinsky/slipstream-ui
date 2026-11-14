'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { formatDateLabel } from '../../utils/date';
import { buttonVariants } from '../button';
import { Calendar } from '../calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';

export type DatePickerPopoverProps = {
  /** Selected date as an ISO key (`YYYY-MM-DD`). */
  value?: string;
  /** Called with the ISO key when a day is chosen. */
  onValueChange?: (value: string) => void;
  /** Earliest selectable day, inclusive. */
  min?: string;
  /** Latest selectable day, inclusive. */
  max?: string;
  /** Override "today" for deterministic rendering. */
  today?: string;
  locale?: string;
  weekStartsOn?: 0 | 1;
  /** Text shown before a date is chosen. */
  placeholder?: string;
  /** Renders a hidden input so the value posts with a native form. */
  name?: string;
  required?: boolean;
  disabled?: boolean;
  /** Preferred side of the field; flips when it cannot fit. */
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  id?: string;
  className?: string;
  'aria-label'?: string;
};

/**
 * Date field with a month-grid panel. Values stay ISO `YYYY-MM-DD` strings, so
 * a browser in a different zone cannot shift the chosen day.
 */
const DatePickerPopover = React.forwardRef<HTMLButtonElement, DatePickerPopoverProps>(
  (
    {
      value,
      onValueChange,
      min,
      max,
      today,
      locale = 'en-US',
      weekStartsOn = 0,
      placeholder = 'Pick a date',
      name,
      required,
      disabled,
      side = 'bottom',
      align = 'start',
      id,
      className,
      'aria-label': ariaLabel,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const setTriggerRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const label = value ? formatDateLabel(value, locale) : placeholder;

    return (
      <>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            ref={setTriggerRef}
            id={id}
            disabled={disabled}
            aria-label={ariaLabel}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'w-full justify-start font-normal',
              !value && 'text-muted-foreground',
              className
            )}
          >
            {label}
          </PopoverTrigger>
          <PopoverContent side={side} align={align} matchTriggerWidth className="w-auto p-3">
            <Calendar
              value={value}
              min={min}
              max={max}
              today={today}
              locale={locale}
              weekStartsOn={weekStartsOn}
              autoFocus
              onValueChange={(next) => {
                onValueChange?.(next);
                setOpen(false);
                triggerRef.current?.focus();
              }}
            />
          </PopoverContent>
        </Popover>
        {name ? <input type="hidden" name={name} value={value ?? ''} required={required} /> : null}
      </>
    );
  }
);
DatePickerPopover.displayName = 'DatePickerPopover';

export { DatePickerPopover };
