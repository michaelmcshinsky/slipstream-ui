export type DateParts = { year: number; month: number; day: number };

export type CalendarMove =
  | 'left'
  | 'right'
  | 'up'
  | 'down'
  | 'home'
  | 'end'
  | 'pageup'
  | 'pagedown';

const DAY_MS = 86_400_000;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** Builds an ISO date key from zero-based month. */
export function dateKeyOf(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

/** True for a real calendar day in `YYYY-MM-DD` form. */
export function isValidDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parts = parseDateKey(value);
  if (!parts) return false;
  return dateKeyOf(parts.year, parts.month, parts.day) === value;
}

/** Parses a key, or returns null when it is not a real date. */
export function parseDateKey(value: string): DateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  if (month < 0 || month > 11 || day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function utc(key: string): Date {
  const parts = parseDateKey(key);
  if (!parts) return new Date(Date.UTC(1970, 0, 1));
  return new Date(Date.UTC(parts.year, parts.month, parts.day));
}

/** Local-calendar key for a real-world Date (today, a picked day). */
export function toDateKey(date: Date): string {
  return dateKeyOf(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Key for a Date built with Date.UTC, so arithmetic never drifts by zone. */
function utcKey(date: Date): string {
  return dateKeyOf(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function todayKey(now = new Date()): string {
  return toDateKey(now);
}

export function addDays(key: string, delta: number): string {
  const date = utc(key);
  return utcKey(new Date(date.getTime() + delta * DAY_MS));
}

/** Month move that clamps the day instead of rolling into the next month. */
export function addMonths(key: string, delta: number): string {
  const parts = parseDateKey(key);
  if (!parts) return key;
  const index = parts.year * 12 + parts.month + delta;
  const year = Math.floor(index / 12);
  const month = index % 12;
  return dateKeyOf(year, month, Math.min(parts.day, daysInMonth(year, month)));
}

export function startOfWeek(key: string, weekStartsOn: 0 | 1 = 0): string {
  const date = utc(key);
  const offset = (date.getUTCDay() - weekStartsOn + 7) % 7;
  return addDays(key, -offset);
}

/** Next date key for a keyboard move. */
export function moveDateKey(key: string, move: CalendarMove, weekStartsOn: 0 | 1 = 0): string {
  switch (move) {
    case 'left':
      return addDays(key, -1);
    case 'right':
      return addDays(key, 1);
    case 'up':
      return addDays(key, -7);
    case 'down':
      return addDays(key, 7);
    case 'home':
      return startOfWeek(key, weekStartsOn);
    case 'end':
      return addDays(startOfWeek(key, weekStartsOn), 6);
    case 'pageup':
      return addMonths(key, -1);
    case 'pagedown':
      return addMonths(key, 1);
  }
}

export type CalendarDay = {
  key: string;
  day: number;
  inMonth: boolean;
};

/** Six stable weeks of cells, including leading/trailing neighbour days. */
export function calendarWeeks(
  year: number,
  month: number,
  weekStartsOn: 0 | 1 = 0
): CalendarDay[][] {
  const first = dateKeyOf(year, month, 1);
  const start = startOfWeek(first, weekStartsOn);
  return Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => {
      const key = addDays(start, week * 7 + day);
      const parts = parseDateKey(key);
      return {
        key,
        day: parts?.day ?? 1,
        inMonth: parts?.month === month && parts?.year === year,
      };
    })
  );
}

export function monthLabel(year: number, month: number, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month, 1)));
}

export function weekdayLabels(locale = 'en-US', weekStartsOn: 0 | 1 = 0): string[] {
  return Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }).format(
      new Date(Date.UTC(2024, 0, 7 + weekStartsOn + index))
    )
  );
}

export function formatDateLabel(key: string, locale = 'en-US'): string {
  const parts = parseDateKey(key);
  if (!parts) return key;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(parts.year, parts.month, parts.day)));
}
