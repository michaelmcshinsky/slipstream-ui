'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

export type ThemeToggleProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  /** Current theme. */
  theme: 'light' | 'dark';
  /** Fired with the next theme when the user toggles. */
  onThemeChange: (theme: 'light' | 'dark') => void;
  /** Accessible labels for the action that will happen next. */
  labels?: {
    toLight?: string;
    toDark?: string;
  };
  /** Control size. */
  size?: 'sm' | 'md';
};

/**
 * Presentational light/dark toggle. The consumer owns persistence and the
 * actual class/attribute switch; this component only renders the control,
 * the accessible label, and the sun/moon state.
 */
export const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(function ThemeToggle(
  { theme, onThemeChange, labels, size = 'md', className, ...props },
  ref
) {
  const next = theme === 'dark' ? 'light' : 'dark';
  const label =
    next === 'dark'
      ? (labels?.toDark ?? 'Switch to dark theme')
      : (labels?.toLight ?? 'Switch to light theme');

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      onClick={() => onThemeChange(next)}
      className={cn(
        'inline-flex items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors',
        'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-50',
        size === 'sm' ? 'h-8 w-8' : 'h-9 w-9',
        className
      )}
      {...props}
    >
      {theme === 'dark' ? (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      )}
    </button>
  );
});

ThemeToggle.displayName = 'ThemeToggle';
