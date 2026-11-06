import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

const CORE_COMPONENTS = path.resolve(process.cwd(), 'src', 'components');
const AI_COMPONENTS = path.resolve(process.cwd(), '..', 'ai', 'src', 'components');
const V4_CSS = path.resolve(process.cwd(), '..', 'themes', 'tailwind-v4.css');

const COLOR_TOKENS = [
  'primary-foreground',
  'secondary-foreground',
  'destructive-foreground',
  'success-foreground',
  'warning-foreground',
  'warning-ink',
  'info-foreground',
  'info-ink',
  'muted-foreground',
  'accent-foreground',
  'card-foreground',
  'popover-foreground',
  'background',
  'foreground',
  'primary',
  'secondary',
  'destructive',
  'success',
  'warning',
  'info',
  'muted',
  'accent',
  'border',
  'input',
  'ring',
  'card',
  'popover',
] as const;

const PREFIXES = ['placeholder', 'decoration', 'outline', 'divide', 'accent', 'caret', 'border', 'stroke', 'fill', 'ring', 'text', 'from', 'via', 'to', 'bg'] as const;

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name.endsWith('.tsx') && !entry.name.includes('.test.')) files.push(full);
  }
  return files;
}

function findColorTokens(source: string): Set<string> {
  const tokens = new Set<string>();
  const tokenPattern = new RegExp(
    `\\b(?:${PREFIXES.join('|')})-(${COLOR_TOKENS.join('|')})(?:\\/[\\w.]+)?\\b`,
    'g',
  );
  for (const match of source.matchAll(tokenPattern)) tokens.add(match[1]);
  return tokens;
}

describe('Tailwind v4 theme contract', () => {
  const css = fs.readFileSync(V4_CSS, 'utf8');
  const files = [...walk(CORE_COMPONENTS), ...walk(AI_COMPONENTS)];

  it('finds the component sources it is meant to protect', () => {
    expect(files.length).toBeGreaterThan(70);
  });

  it('declares a dark variant for class-based dark mode', () => {
    expect(css).toContain('@custom-variant dark');
    expect(css).toContain('.dark');
  });

  it('defines a v4 color token for every semantic color the components use', () => {
    const used = new Set<string>();
    for (const file of files) {
      for (const token of findColorTokens(fs.readFileSync(file, 'utf8'))) used.add(token);
    }

    expect(used.size).toBeGreaterThan(10);
    const missing = [...used].filter((token) => !css.includes(`--color-${token}:`));
    expect(missing).toEqual([]);
  });

  it('maps every color token documented by ThemeColors', () => {
    const missing = COLOR_TOKENS.filter((token) => !css.includes(`--color-${token}:`));
    expect(missing).toEqual([]);
  });

  it('keeps radius, density and motion tokens', () => {
    for (const token of ['--radius-lg', '--radius-md', '--radius-sm', '--spacing-density', '--spacing-control-height', '--transition-duration-fast', '--transition-duration-normal', '--transition-duration-slow', '--ease-standard', '--ease-in', '--ease-out']) {
      expect(css).toContain(`${token}:`);
    }
  });

  it('keeps the accordion animations used by Accordion', () => {
    expect(css).toContain('--animate-accordion-down');
    expect(css).toContain('--animate-accordion-up');
    expect(css).toContain('@keyframes accordion-down');
    expect(css).toContain('@keyframes accordion-up');
  });
});
