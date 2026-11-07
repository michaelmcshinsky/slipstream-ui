'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../button/Button';
import { Checkbox } from '../checkbox/Checkbox';
import { Input } from '../input/Input';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/Popover';

export type MultiSelectOption = {
  value: string;
  label: string;
  description?: string;
  group?: string;
  disabled?: boolean;
};

export type MultiSelectProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'value' | 'onChange'> & {
  /** Options to choose from. */
  options: MultiSelectOption[];
  /** Controlled selected values. */
  value?: string[];
  /** Initial selected values when uncontrolled. */
  defaultValue?: string[];
  /** Fires with the full selection after every change. */
  onValueChange?: (values: string[]) => void;
  /** Visible field label. */
  label?: string;
  /** Trigger text when nothing is selected. Default "Add". */
  triggerLabel?: string;
  /** Search placeholder. Default "Search options". */
  searchPlaceholder?: string;
  /** Shown when no option matches. */
  emptyText?: string;
  /** Maximum chips shown before a "+N more" summary. Default 3. */
  maxDisplay?: number;
  disabled?: boolean;
};

/**
 * Multi-select filter with removable chips, a searchable popover and native
 * checkbox options. Unlike SelectMenu's compact trigger, this exposes the
 * selection as chips so dashboards can show applied filters without opening
 * the panel.
 */
export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(function MultiSelect(
  {
    options,
    value,
    defaultValue,
    onValueChange,
    label,
    triggerLabel = 'Add',
    searchPlaceholder = 'Search options',
    emptyText = 'No options',
    maxDisplay = 3,
    disabled = false,
    className,
    ...props
  },
  ref
) {
  const labelId = React.useId();
  const [internal, setInternal] = React.useState<string[]>(defaultValue ?? []);
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const selected = value ?? internal;

  const commit = (next: string[]) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const toggle = (option: MultiSelectOption) => {
    if (option.disabled) return;
    commit(
      selected.includes(option.value)
        ? selected.filter((entry) => entry !== option.value)
        : [...selected, option.value]
    );
  };

  const selectedOptions = options.filter((option) => selected.includes(option.value));
  const filtered = query.trim()
    ? options.filter((option) => {
        const q = query.trim().toLowerCase();
        return (
          option.label.toLowerCase().includes(q) ||
          option.value.toLowerCase().includes(q) ||
          option.description?.toLowerCase().includes(q) ||
          option.group?.toLowerCase().includes(q)
        );
      })
    : options;

  const groups = React.useMemo(() => {
    let last: string | undefined;
    return filtered.map((option) => {
      const heading = option.group && option.group !== last ? option.group : undefined;
      last = option.group;
      return { option, heading };
    });
  }, [filtered]);

  const visibleChips = selectedOptions.slice(0, maxDisplay);
  const hiddenCount = selectedOptions.length - visibleChips.length;

  return (
    <div ref={ref} className={cn('flex flex-col gap-2', className)} {...props}>
      {label && (
        <span id={labelId} className="text-sm font-medium">
          {label}
        </span>
      )}
      {visibleChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {visibleChips.map((option) => (
            <span
              key={option.value}
              className="inline-flex max-w-full items-center gap-1 rounded-full border border-border bg-muted/60 py-0.5 pl-2.5 pr-1 text-xs"
            >
              <span className="truncate">{option.label}</span>
              <button
                type="button"
                onClick={() => toggle(option)}
                disabled={disabled}
                aria-label={`Remove ${option.label}`}
                className="rounded-full p-1 text-muted-foreground hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none"
              >
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="m5 5 10 10M15 5 5 15" />
                </svg>
              </button>
            </span>
          ))}
          {hiddenCount > 0 && <span className="self-center text-xs text-muted-foreground">+{hiddenCount} more</span>}
        </div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger aria-labelledby={label ? labelId : undefined} disabled={disabled} className="w-full justify-between">
          <span>{selected.length > 0 ? `${selected.length} selected` : triggerLabel}</span>
          <span aria-hidden="true" className="text-muted-foreground">⌄</span>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <div className="border-b border-border p-3">
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              autoFocus
            />
          </div>
          <div className="max-h-64 overflow-y-auto p-1">
            {groups.length === 0 ? (
              <p className="px-3 py-3 text-sm text-muted-foreground">{emptyText}</p>
            ) : (
              groups.map(({ option, heading }) => (
                <React.Fragment key={option.value}>
                  {heading && (
                    <p className="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {heading}
                    </p>
                  )}
                  <label
                    className={cn(
                      'flex cursor-pointer items-start gap-2.5 rounded-md px-3 py-2 text-sm hover:bg-accent/60',
                      option.disabled && 'cursor-not-allowed opacity-50'
                    )}
                  >
                    <Checkbox
                      checked={selected.includes(option.value)}
                      onCheckedChange={() => toggle(option)}
                      disabled={option.disabled}
                      className="mt-0.5"
                    />
                    <span className="min-w-0">
                      <span className="block">{option.label}</span>
                      {option.description && (
                        <span className="mt-0.5 block text-xs text-muted-foreground">{option.description}</span>
                      )}
                    </span>
                  </label>
                </React.Fragment>
              ))
            )}
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-border p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => commit(options.filter((option) => !option.disabled).map((option) => option.value))}
            >
              Select all
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => commit([])}>
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
});
