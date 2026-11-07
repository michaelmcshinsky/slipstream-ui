import { en, type Messages } from './en';

/**
 * Pseudo-locale catalog for layout stress testing.
 *
 * Every English string is wrapped in brackets and its vowels are doubled so
 * translated copy is visibly longer than the source. This catches truncated
 * labels, fixed-width buttons and horizontal overflow without needing a real
 * translation. Keys are identical to `en`, so `t()` and `tPlural()` work
 * unchanged.
 */

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);

function pseudoString(value: string): string {
  const expanded = value.replace(/[A-Za-z]/g, (char) =>
    VOWELS.has(char) ? `${char}${char}` : char
  );
  return `[[${expanded}]]`;
}

function transform(value: unknown): unknown {
  if (typeof value === 'string') return pseudoString(value);
  if (Array.isArray(value)) return value.map(transform);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, transform(entry)])
    );
  }
  return value;
}

export const pseudoMessages = transform(en) as Messages;
