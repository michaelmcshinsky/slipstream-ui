'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import {
  addMonths,
  calendarWeeks,
  formatDateLabel,
  monthLabel,
  parseDateKey,
  todayKey,
  weekdayLabels,
} from '../../utils/date';
import { Badge } from '../badge/Badge';
import { Button } from '../button';

export type MonthScheduleLegendItem = {
  /** Type key returned by getType. */
  type: string;
  /** Human-readable label shown in the legend. */
  label: string;
};

export type MonthScheduleProps<T> = {
  /** Events to place inside days; each is dated via getDate. */
  events: T[];
  /** ISO date key (YYYY-MM-DD) for an event. */
  getDate: (event: T) => string;
  /** Short label shown on the day chip and in the agenda. */
  getLabel: (event: T) => string;
  /** Optional type key used for chip color and the legend. */
  getType?: (event: T) => string;
  /** Optional destination per event. */
  getHref?: (event: T) => string;
  /** Controlled month as YYYY-MM. Falls back to defaultMonth, then today. */
  month?: string;
  /** Uncontrolled initial month (YYYY-MM). */
  defaultMonth?: string;
  /** Called with the new YYYY-MM when paging. */
  onMonthChange?: (month: string) => void;
  /** Override "today" for deterministic server rendering and tests. */
  today?: string;
  /** BCP-47 locale for month, weekday and agenda labels. */
  locale?: string;
  /** 0 starts the week on Sunday, 1 on Monday. */
  weekStartsOn?: 0 | 1;
  /** Maximum event chips per day before collapsing into "+N more". */
  maxPerDay?: number;
  /** Type key → label/color entries rendered as a legend under the grid. */
  legend?: MonthScheduleLegendItem[];
  /**
   * Below this breakpoint an agenda list replaces the day grid:
   * 'sm' swaps under 640px, 'md' under 768px.
   */
  agendaBreakpoint?: 'sm' | 'md';
  /** Custom link element for event hrefs (Next Link, react-router). */
  linkComponent?: React.ElementType;
  /** Prop used to pass the destination to linkComponent ('href' or 'to'). */
  linkHrefProp?: 'href' | 'to';
  'aria-label'?: string;
  className?: string;
};

// Deterministic tone per type so chips and legend agree without a color map
// in consumer code. Order chosen for adjacent contrast.
const TYPE_TONES = [
  'outline-info',
  'outline-success',
  'outline-warning',
  'outline-danger',
  'outline',
] as const;

type Tone = (typeof TYPE_TONES)[number];

function typeTone(type: string | undefined, legend: MonthScheduleLegendItem[] | undefined): Tone {
  if (!type) return 'outline';
  const index = legend?.findIndex((item) => item.type === type) ?? -1;
  if (index >= 0) return TYPE_TONES[index % TYPE_TONES.length];
  // Stable hash fallback for types missing from the legend.
  let hash = 0;
  for (let i = 0; i < type.length; i += 1) hash = (hash * 31 + type.charCodeAt(i)) >>> 0;
  return TYPE_TONES[hash % TYPE_TONES.length];
}

function monthOf(key: string): { year: number; month: number } {
  const parts = parseDateKey(`${key}-01`);
  return { year: parts?.year ?? 1970, month: parts?.month ?? 0 };
}

function shiftMonth(monthKey: string, delta: number): string {
  const { year, month } = monthOf(monthKey);
  const shifted = addMonths(`${year}-${String(month + 1).padStart(2, '0')}-01`, delta);
  return shifted.slice(0, 7);
}

/**
 * Month schedule: a month grid with dated events rendered inside each day,
 * plus a legend and a small-screen agenda. Built on the same date utilities
 * as Calendar; `today` stays explicit so server-rendered pages never read the
 * server clock.
 */
export function MonthSchedule<T>({
  events,
  getDate,
  getLabel,
  getType,
  getHref,
  month,
  defaultMonth,
  onMonthChange,
  today,
  locale = 'en-US',
  weekStartsOn = 0,
  maxPerDay = 3,
  legend,
  agendaBreakpoint = 'md',
  linkComponent,
  linkHrefProp = 'href',
  'aria-label': ariaLabel,
  className,
}: MonthScheduleProps<T>) {
  const resolvedToday = today ?? todayKey();
  const Link = linkComponent ?? 'a';
  const [internalMonth, setInternalMonth] = React.useState(
    () => month ?? defaultMonth ?? resolvedToday.slice(0, 7)
  );
  const activeMonth = month ?? internalMonth;
  const { year, month: monthIndex } = monthOf(activeMonth);

  const byDay = React.useMemo(() => {
    const map = new Map<string, T[]>();
    for (const event of events) {
      const key = getDate(event);
      const list = map.get(key);
      if (list) list.push(event);
      else map.set(key, [event]);
    }
    for (const list of map.values()) {
      list.sort((a, b) => getLabel(a).localeCompare(getLabel(b)));
    }
    return map;
  }, [events, getDate, getLabel]);

  const weeks = React.useMemo(
    () => calendarWeeks(year, monthIndex, weekStartsOn),
    [year, monthIndex, weekStartsOn]
  );
  const weekdays = React.useMemo(
    () => weekdayLabels(locale, weekStartsOn),
    [locale, weekStartsOn]
  );
  const monthName = monthLabel(year, monthIndex, locale);
  const agendaDays = React.useMemo(
    () =>
      [...byDay.keys()]
        .filter((key) => key.startsWith(activeMonth))
        .sort()
        .map((key) => ({ key, items: byDay.get(key) ?? [] })),
    [byDay, activeMonth]
  );

  const page = (delta: number) => {
    const next = shiftMonth(activeMonth, delta);
    if (month === undefined) setInternalMonth(next);
    onMonthChange?.(next);
  };

  const renderEvent = (event: T, key: string) => {
    const label = getLabel(event);
    const type = getType?.(event);
    const tone = typeTone(type, legend);
    const href = getHref?.(event);
    const chip = (
      <Badge variant={tone} size="sm" className="max-w-full truncate">
        {label}
      </Badge>
    );
    if (!href) return <span key={key}>{chip}</span>;
    const destination = linkHrefProp === 'to' ? { to: href } : { href };
    return (
      <Link
        key={key}
        {...destination}
        className="block max-w-full rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {chip}
      </Link>
    );
  };

  const gridHidden = agendaBreakpoint === 'sm' ? 'hidden sm:block' : 'hidden md:block';
  const agendaHidden = agendaBreakpoint === 'sm' ? 'sm:hidden' : 'md:hidden';

  return (
    <div className={cn('w-full select-none', className)}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Previous month"
          onClick={() => page(-1)}
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
          onClick={() => page(1)}
        >
          ›
        </Button>
      </div>

      <div
        role="grid"
        aria-label={ariaLabel ?? monthName}
        className={cn('flex flex-col gap-1', gridHidden)}
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
              const dayEvents = byDay.get(day.key) ?? [];
              const visible = dayEvents.slice(0, maxPerDay);
              const overflow = dayEvents.length - visible.length;
              const isToday = day.key === resolvedToday;

              return (
                <div
                  key={day.key}
                  role="gridcell"
                  aria-current={isToday ? 'date' : undefined}
                  className={cn(
                    'flex min-h-16 flex-col gap-0.5 rounded-md border border-transparent p-1',
                    !day.inMonth && 'opacity-50',
                    isToday && 'border-primary/40 bg-primary/5'
                  )}
                >
                  <span
                    className={cn(
                      'self-start px-1 text-xs tabular-nums',
                      isToday ? 'font-semibold text-primary-ink' : 'text-muted-foreground'
                    )}
                  >
                    {day.day}
                  </span>
                  {visible.map((event, index) =>
                    renderEvent(event, `${day.key}-${index}-${getLabel(event)}`)
                  )}
                  {overflow > 0 && (
                    <span className="px-1 text-[11px] text-muted-foreground">
                      +{overflow} more
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className={cn('flex flex-col gap-3', agendaHidden)}>
        {agendaDays.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No events this month.</p>
        ) : (
          agendaDays.map(({ key, items }) => (
            <section key={key} aria-label={formatDateLabel(key, locale)}>
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {formatDateLabel(key, locale)}
              </h3>
              <ul className="flex flex-col gap-1">
                {items.map((event, index) => {
                  const label = getLabel(event);
                  const type = getType?.(event);
                  const tone = typeTone(type, legend);
                  const href = getHref?.(event);
                  const row = (
                    <Badge variant={tone} size="sm" className="max-w-full truncate">
                      {label}
                    </Badge>
                  );
                  return (
                    <li key={`${key}-${index}-${label}`}>
                      {href ? (
                        <Link
                          {...(linkHrefProp === 'to' ? { to: href } : { href })}
                          className="block max-w-full rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {row}
                        </Link>
                      ) : (
                        row
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>

      {legend && legend.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1" aria-label="Event types">
          {legend.map((item) => (
            <li key={item.type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Badge variant={typeTone(item.type, legend)} size="sm">
                {item.label}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

MonthSchedule.displayName = 'MonthSchedule';
