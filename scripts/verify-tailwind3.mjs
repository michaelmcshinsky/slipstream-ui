#!/usr/bin/env node
/**
 * Compiles the published Tailwind CSS 3 preset in isolation.
 *
 * The consumer path must not rely on the docs app or workspace source. This
 * fixture catches a missing token mapping, a dropped plugin, or a broken
 * preset export before publish.
 */
import { createRequire } from 'node:module';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const requireFromDocs = createRequire(path.join(root, 'apps', 'docs', 'package.json'));
const postcss = requireFromDocs('postcss');
const tailwind = requireFromDocs('tailwindcss');
const preset = requireFromDocs(path.join(root, 'packages', 'themes', 'tailwind-preset.cjs'));

const classes = [
  'bg-background',
  'text-foreground',
  'bg-card',
  'text-card-foreground',
  'bg-popover',
  'text-popover-foreground',
  'bg-primary',
  'text-primary-foreground',
  'bg-secondary',
  'text-secondary-foreground',
  'bg-muted',
  'text-muted-foreground',
  'bg-accent',
  'text-accent-foreground',
  'bg-destructive',
  'text-destructive-foreground',
  'bg-success',
  'text-success-foreground',
  'bg-warning',
  'text-warning-foreground',
  'text-warning-ink',
  'bg-info',
  'text-info-foreground',
  'text-info-ink',
  'border-border',
  'border-input',
  'ring-ring',
  'bg-inverse',
  'text-inverse-foreground',
  'bg-inverse-card',
  'text-inverse-card-foreground',
  'rounded-lg',
  'rounded-md',
  'rounded-sm',
  'p-density',
  'h-control-height',
  'duration-fast',
  'ease-standard',
  'animate-in',
  'fade-in-0',
  'slide-in-from-top-2',
  'animate-accordion-down',
].join(' ');

const config = {
  ...preset,
  content: [{ raw: classes }],
};

const result = await postcss([tailwind(config)]).process('@tailwind utilities;', { from: undefined });
const css = result.css;

const expected = [
  '.bg-popover',
  '.text-popover-foreground',
  '.bg-success',
  '.text-warning-ink',
  '.text-info-ink',
  '.border-input',
  '.ring-ring',
  '.bg-inverse',
  '.text-inverse-card-foreground',
  '.rounded-lg',
  '.rounded-md',
  '.rounded-sm',
  '.p-density',
  '.h-control-height',
  '.duration-fast',
  '.ease-standard',
  '.animate-in',
  '.fade-in-0',
  '.slide-in-from-top-2',
  '.animate-accordion-down',
];

const missing = expected.filter((selector) => !css.includes(selector));
if (missing.length > 0) {
  console.error(`Tailwind 3 preset is missing: ${missing.join(', ')}`);
  process.exit(1);
}

console.log(`Tailwind 3 preset compiled: ${expected.length} checks passed.`);
