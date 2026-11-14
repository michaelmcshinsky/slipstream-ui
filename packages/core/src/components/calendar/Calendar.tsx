'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import {
  addMonths,
  calendarWeeks,
  formatDateLabel,
  monthLabel,
  moveDateKey,
  parseDateKey,
  todayKey,
  weekdayLabels,
  type CalendarMove,
} from '../../utils/date';
import { Button } from '../button';

export type CalendarProps = {
  /** Controlled ISO date key (`YYYY-MM-DD`). */
  value?: string;
  /** Uncontrolled initial date key. */
  defaultValue?: string;
  /** Called with the ISO key when a day is chosen. */
  onValueChange?: (value: string) => void;
  /** Earliest selectable day, inclusive. */
  min?: string;
  /** Latest selectable day, inclusive. */
  max?: string;
  /** Override "today" (testing and server-rendered determinism). */
  today?: string;
  /** BCP-47 locale for month and weekday labels. */
  locale?: string;
  /** 0 starts the week on Sunday, 1 on Monday. */
  weekStartsOn?: 0 | 1;
  /** Block individual days beyond min/max. */
  isDateDisabled?: (value: string) => boolean;
  /** Show leading/trailing days from the neighbouring months. */
  showOutsideDays?: boolean;
  /** Focus the active day when the calendar mounts or opens. */
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
};

const MOVES: Record<string, CalendarMove> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
  Home: 'home',
  End: 'end',
  PageUp: 'pageup',
  PageDown: 'pagedown',
};

/**
 * Month grid with ISO date keys and full keyboard support. Controlled via
 * `value`/`onValueChange`, or uncontrolled with `defaultValue`.
 */
const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      min,
      max,
      today,
      locale = 'en-US',
      weekStartsOn = 0,
      isDateDisabled,
      showOutsideDays = true,
      autoFocus = false,
      disabled = false,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const resolvedToday = today ?? todayKey();
    const [internal, setInternal] = React.useState(defaultValue ?? '');
    const selected = value ?? internal;
    const initial = selected || resolvedToday;
    const [view, setView] = React.useState(() => {
      const parts = parseDateKey(initial);
      return { year: parts?.year ?? 1970, month: parts?.month ?? 0 };
    });
    const [focusKey, setFocusKey] = React.useState(initial);
    const gridRef = React.useRef<HTMLDivElement | null>(null);

    // Follow an externally controlled value into its month.
    React.useEffect(() => {
      if (!selected) return;
      const parts = parseDateKey(selected);
      if (parts) setView({ year: parts.year, month: parts.month });
      setFocusKey(selected);
    }, [selected]);

    const weeks = React.useMemo(
      () => calendarWeeks(view.year, view.month, weekStartsOn),
      [view.year, view.month, weekStartsOn]
    );
    const weekdays = React.useMemo(
      () => weekdayLabels(locale, weekStartsOn),
      [locale, weekStartsOn]
    );

    const blocked = React.useCallback(
      (key: string) =>
        disabled ||
        Boolean((min && key < min) || (max && key > max)) ||
        Boolean(isDateDisabled?.(key)),
      [disabled, isDateDisabled, max, min]
    );

    const choose = (key: string) => {
      if (blocked(key)) return;
      if (value === undefined) setInternal(key);
      setFocusKey(key);
      onValueChange?.(key);
    };

    const onGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const move = MOVES[event.key];
      if (!move) return;
      event.preventDefault();
      const next = moveDateKey(focusKey, move, weekStartsOn);
      const parts = parseDateKey(next);
      if (parts) setView({ year: parts.year, month: parts.month });
      setFocusKey(next);
    };

    // Keep one tabbable day: the active one when visible, otherwise the first.
    const visibleKeys = weeks.flat().filter((day) => day.inMonth);
    const tabbable = visibleKeys.some((day) => day.key === focusKey)
      ? focusKey
      : (visibleKeys[0]?.key ?? '');

    React.useEffect(() => {
      if (!autoFocus) return;
      const timer = setTimeout(() => {
        gridRef.current
          ?.querySelector<HTMLButtonElement>(`[data-date="${tabbable}"]`)
          ?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }, [autoFocus, tabbable, view.year, view.month]);

    const monthName = monthLabel(view.year, view.month, locale);

    return (
      <div
        ref={ref}
        className={cn('w-72 select-none', className)}
        data-disabled={disabled ? '' : undefined}
        {...props}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Previous month"
            disabled={disabled}
            onClick={() => setView(partsOf(addMonths(keyOf(view), -1)))}
          >
            ‹
          </Button>
          <div aria-live="polite" className="text-sm font-semibold text-foreground">
            {monthName}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Next month"
            disabled={disabled}
            onClick={() => setView(partsOf(addMonths(keyOf(view), 1)))}
          >
            ›
          </Button>
        </div>

        <div
          ref={gridRef}
          role="grid"
          aria-label={ariaLabel ?? monthName}
          onKeyDown={onGridKeyDown}
          className="flex flex-col gap-1"
        >
          <div role="row" className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
            {weekdays.map((weekday) => (
              <span key={weekday} role="columnheader" aria-label={weekday} className="py-1">
                {weekday}
              </span>
            ))}
          </div>

          {weeks.map((week) => (
            <div key={week[0]?.key} role="row" className="grid grid-cols-7 gap-1">
              {week.map((day) => {
                const isSelected = day.key === selected;
                const isToday = day.key === resolvedToday;
                const isBlocked = blocked(day.key);
                const hidden = !day.inMonth && !showOutsideDays;

                if (hidden) {
                  return (
                    <div key={day.key} role="gridcell" aria-hidden="true" className="h-9 w-9" />
                  );
                }

                return (
                  <div
                    key={day.key}
                    role="gridcell"
                    aria-selected={isSelected}
                    className="flex justify-center"
                  >
                    <Button
                      type="button"
                      size="sm"
                      variant={isSelected ? 'primary' : 'ghost'}
                      data-date={day.key}
                      tabIndex={day.key === tabbable ? 0 : -1}
                      aria-current={isToday ? 'date' : undefined}
                      aria-disabled={isBlocked || undefined}
                      aria-label={formatDateLabel(day.key, locale)}
                      className={cn(
                        'h-9 w-9 p-0 font-normal',
                        !day.inMonth && 'text-muted-foreground/50',
                        isBlocked && 'cursor-not-allowed opacity-40',
                        isToday && !isSelected && 'ring-1 ring-primary'
                      )}
                      onClick={() => choose(day.key)}
                    >
                      {day.day}
                    </Button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
Calendar.displayName = 'Calendar';

function keyOf(view: { year: number; month: number }): string {
  return `${view.year}-${String(view.month + 1).padStart(2, '0')}-01`;
}

function partsOf(key: string): { year: number; month: number } {
  const parts = parseDateKey(key);
  return { year: parts?.year ?? 1970, month: parts?.month ?? 0 };
}

export { Calendar };
