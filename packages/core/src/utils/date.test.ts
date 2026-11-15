import { describe, expect, it } from 'vitest';
import {
  addDays,
  addMonths,
  calendarWeeks,
  dateKeyOf,
  daysInMonth,
  formatDateLabel,
  isValidDateKey,
  monthLabel,
  moveDateKey,
  parseDateKey,
  startOfWeek,
  todayKey,
  weekdayLabels,
} from './date';

describe('date keys', () => {
  it('builds and parses a key', () => {
    expect(dateKeyOf(2026, 10, 13)).toBe('2026-11-13');
    expect(parseDateKey('2026-11-13')).toEqual({ year: 2026, month: 10, day: 13 });
  });

  it('rejects impossible dates', () => {
    expect(isValidDateKey('2026-13-01')).toBe(false);
    expect(isValidDateKey('2026-02-30')).toBe(false);
    expect(isValidDateKey('2026-1-1')).toBe(false);
    expect(isValidDateKey('not-a-date')).toBe(false);
    expect(parseDateKey('2026-02-30')).toBeNull();
  });

  it('accepts a leap day only in a leap year', () => {
    expect(isValidDateKey('2028-02-29')).toBe(true);
    expect(isValidDateKey('2026-02-29')).toBe(false);
  });

  it('round-trips today', () => {
    const now = new Date(2026, 10, 13);
    expect(todayKey(now)).toBe('2026-11-13');
  });
});

describe('arithmetic', () => {
  it('adds days across month and year boundaries', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(addDays('2028-03-01', -1)).toBe('2028-02-29');
  });

  it('clamps the day when adding months', () => {
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonths('2028-01-31', 1)).toBe('2028-02-29');
    expect(addMonths('2026-03-31', -1)).toBe('2026-02-28');
    expect(addMonths('2026-12-15', 1)).toBe('2027-01-15');
  });
});

describe('weeks', () => {
  it('starts on Sunday or Monday', () => {
    expect(startOfWeek('2026-11-13', 0)).toBe('2026-11-08');
    expect(startOfWeek('2026-11-13', 1)).toBe('2026-11-09');
  });

  it('returns six weeks of seven days with neighbour flags', () => {
    const weeks = calendarWeeks(2026, 10, 0);
    expect(weeks).toHaveLength(6);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(weeks[0]?.[0]?.key).toBe('2026-11-01');
    expect(weeks[0]?.[0]?.inMonth).toBe(true);
    expect(weeks.flat().filter((day) => day.inMonth)).toHaveLength(30);
  });

  it('marks leading days from the previous month', () => {
    const weeks = calendarWeeks(2026, 10, 1);
    expect(weeks[0]?.[0]?.key).toBe('2026-10-26');
    expect(weeks[0]?.[0]?.inMonth).toBe(false);
  });
});

describe('moveDateKey', () => {
  it('moves by day and by week', () => {
    expect(moveDateKey('2026-11-13', 'left')).toBe('2026-11-12');
    expect(moveDateKey('2026-11-13', 'right')).toBe('2026-11-14');
    expect(moveDateKey('2026-11-13', 'up')).toBe('2026-11-06');
    expect(moveDateKey('2026-11-13', 'down')).toBe('2026-11-20');
  });

  it('moves to week bounds for either week start', () => {
    expect(moveDateKey('2026-11-13', 'home', 0)).toBe('2026-11-08');
    expect(moveDateKey('2026-11-13', 'end', 0)).toBe('2026-11-14');
    expect(moveDateKey('2026-11-13', 'home', 1)).toBe('2026-11-09');
    expect(moveDateKey('2026-11-13', 'end', 1)).toBe('2026-11-15');
  });

  it('pages months with clamping', () => {
    expect(moveDateKey('2026-01-31', 'pagedown')).toBe('2026-02-28');
    expect(moveDateKey('2026-03-31', 'pageup')).toBe('2026-02-28');
    expect(moveDateKey('2026-01-15', 'pageup')).toBe('2025-12-15');
  });
});

describe('labels', () => {
  it('formats month and weekday labels', () => {
    expect(monthLabel(2026, 10, 'en-US')).toBe('November 2026');
    expect(weekdayLabels('en-US', 0)).toHaveLength(7);
    expect(weekdayLabels('en-US', 0)[0]).toBe('Sun');
    expect(weekdayLabels('es-ES', 1)[0]).not.toBe('Sun');
  });

  it('formats a full date for screen readers', () => {
    expect(formatDateLabel('2026-11-13', 'en-US')).toContain('2026');
    expect(formatDateLabel('bad', 'en-US')).toBe('bad');
  });
});

describe('daysInMonth', () => {
  it('knows month lengths including leap years', () => {
    expect(daysInMonth(2026, 1)).toBe(28);
    expect(daysInMonth(2028, 1)).toBe(29);
    expect(daysInMonth(2026, 7)).toBe(31);
    expect(daysInMonth(2026, 11)).toBe(31);
    expect(daysInMonth(2026, 3)).toBe(30);
  });
});

describe('bad input', () => {
  it('rejects impossible month and day numbers', () => {
    expect(parseDateKey('2026-00-10')).toBeNull();
    expect(parseDateKey('2026-13-01')).toBeNull();
    expect(parseDateKey('2026-11-00')).toBeNull();
    expect(parseDateKey('2026-11-32')).toBeNull();
    expect(isValidDateKey('2026-00-10')).toBe(false);
    expect(isValidDateKey('2026-11-00')).toBe(false);
  });

  it('rejects malformed shapes', () => {
    expect(parseDateKey('')).toBeNull();
    expect(parseDateKey('2026-11-13T00:00')).toBeNull();
    expect(parseDateKey(' 2026-11-13')).toBeNull();
    expect(parseDateKey('2026-11-13 ')).toBeNull();
    expect(parseDateKey('20261113')).toBeNull();
  });

  it('returns the input unchanged instead of inventing a date', () => {
    expect(addDays('nope', 1)).toBe('nope');
    expect(addDays('2026-02-30', 1)).toBe('2026-02-30');
    expect(addMonths('nope', 1)).toBe('nope');
    expect(startOfWeek('nope')).toBe('nope');
    expect(moveDateKey('nope', 'down')).toBe('nope');
  });
});

describe('defaults and week grids', () => {
  it('defaults to a Sunday week start', () => {
    expect(startOfWeek('2026-11-13')).toBe('2026-11-08');
    expect(moveDateKey('2026-11-13', 'home')).toBe('2026-11-08');
    expect(weekdayLabels()[0]).toBe('Sun');
    expect(monthLabel(2026, 10)).toBe('November 2026');
  });

  it('produces 42 consecutive days for every month', () => {
    for (const [year, month] of [
      [2026, 0],
      [2026, 7],
      [2028, 1],
      [2026, 11],
    ] as const) {
      const weeks = calendarWeeks(year, month, 0);
      const cells = weeks.flat();
      expect(cells).toHaveLength(42);
      for (let index = 1; index < cells.length; index += 1) {
        expect(cells[index]?.key).toBe(addDays(cells[index - 1]?.key ?? '', 1));
      }
      expect(cells.filter((day) => day.inMonth)).toHaveLength(daysInMonth(year, month));
    }
  });

  it('includes trailing days from the next month', () => {
    const weeks = calendarWeeks(2026, 7, 0);
    const last = weeks[5]?.[6];
    expect(last?.inMonth).toBe(false);
    expect(last?.key.startsWith('2026-09')).toBe(true);
    expect(last?.day).toBe(Number(last?.key.slice(-2)));
  });

  it('round-trips today without an argument', () => {
    expect(todayKey()).toBe(todayKey(new Date()));
  });
});
