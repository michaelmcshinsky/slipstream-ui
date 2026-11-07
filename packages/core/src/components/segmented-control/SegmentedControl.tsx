'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';

export type SegmentedOption = {
  value: string;
  label: React.ReactNode;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  disabled?: boolean;
};

export type SegmentedControlProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  /** Options rendered as segments. */
  options: SegmentedOption[];
  /** Controlled selected value. Use string[] when multiple. */
  value?: string | string[];
  /** Initial selection when uncontrolled. */
  defaultValue?: string | string[];
  /** Fires with the next selection. */
  onValueChange?: (value: string | string[]) => void;
  /** Allow more than one segment to be active. Default false. */
  multiple?: boolean;
  /** Control density. Default 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** Stretch segments to fill the container width. */
  fullWidth?: boolean;
};

const sizeClasses = {
  sm: 'h-8 px-2.5 text-xs',
  md: 'h-9 px-3 text-sm',
  lg: 'h-10 px-4 text-sm',
} as const;

/**
 * Segmented control for switching a view or filter. Single-select uses radio
 * semantics and arrow-key navigation; multiple-select uses pressed buttons.
 * Use it for filters such as All / Investors / Advisors, not for tab panels
 * (use Tabs when each segment owns a tabpanel).
 */
export const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(
    {
      options,
      value,
      defaultValue,
      onValueChange,
      multiple = false,
      size = 'md',
      fullWidth = false,
      className,
      'aria-label': ariaLabel = 'Segmented control',
      ...props
    },
    ref
  ) {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<string | string[]>(() =>
      multiple
        ? Array.isArray(defaultValue)
          ? defaultValue
          : []
        : typeof defaultValue === 'string'
          ? defaultValue
          : ''
    );
    const current = isControlled ? value : internal;
    const selected = multiple
      ? Array.isArray(current)
        ? current
        : []
      : typeof current === 'string'
        ? current
        : '';

    const refs = React.useRef<Array<HTMLButtonElement | null>>([]);

    const commit = (next: string | string[]) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    };

    const select = (option: SegmentedOption) => {
      if (option.disabled) return;
      if (multiple) {
        const currentValues = Array.isArray(selected) ? selected : [];
        commit(
          currentValues.includes(option.value)
            ? currentValues.filter((entry) => entry !== option.value)
            : [...currentValues, option.value]
        );
      } else {
        commit(option.value);
      }
    };

    const moveFocus = (direction: 1 | -1 | 'first' | 'last') => {
      if (multiple) return;
      const enabled = options
        .map((option, index) => ({ option, index }))
        .filter(({ option }) => !option.disabled);
      if (enabled.length === 0) return;
      const activeValue = typeof selected === 'string' ? selected : '';
      const currentIndex = enabled.findIndex(({ option }) => option.value === activeValue);
      let nextIndex: number;
      if (direction === 'first') nextIndex = 0;
      else if (direction === 'last') nextIndex = enabled.length - 1;
      else {
        const from = currentIndex === -1 ? 0 : currentIndex;
        nextIndex = (from + direction + enabled.length) % enabled.length;
      }
      const next = enabled[nextIndex];
      if (!next) return;
      commit(next.option.value);
      refs.current[next.index]?.focus();
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (multiple) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        moveFocus(1);
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        moveFocus(-1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        moveFocus('first');
      } else if (event.key === 'End') {
        event.preventDefault();
        moveFocus('last');
      }
    };

    return (
      <div
        ref={ref}
        role={multiple ? 'group' : 'radiogroup'}
        aria-label={ariaLabel}
        className={cn(
          'inline-flex items-center gap-1 rounded-lg border border-border bg-muted p-1',
          fullWidth && 'flex w-full',
          className
        )}
        {...props}
      >
        {options.map((option, index) => {
          const active = multiple
            ? Array.isArray(selected) && selected.includes(option.value)
            : selected === option.value;
          const firstEnabled = options.findIndex((entry) => !entry.disabled);
          const focusable = multiple || active || (!selected && index === firstEnabled);

          return (
            <button
              key={option.value}
              ref={(node) => {
                refs.current[index] = node;
              }}
              type="button"
              role={multiple ? undefined : 'radio'}
              aria-checked={multiple ? undefined : active}
              aria-pressed={multiple ? active : undefined}
              disabled={option.disabled}
              tabIndex={focusable ? 0 : -1}
              onClick={() => select(option)}
              onKeyDown={onKeyDown}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                'disabled:pointer-events-none disabled:opacity-50',
                sizeClasses[size],
                fullWidth && 'flex-1',
                active
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {option.icon && <span className="shrink-0 [&_svg]:size-4">{option.icon}</span>}
              <span className="truncate">{option.label}</span>
            </button>
          );
        })}
      </div>
    );
  }
);
