'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { Input } from '../input/Input';
import { useCombobox, type ComboboxItem } from './use-combobox';

export type SearchOption = {
  value: string;
  label: string;
  /** Secondary line in the dropdown. */
  description?: string;
  /** Extra words matched while filtering (aliases, category…). */
  keywords?: string;
};

export type SearchProps = {
  /** The full option set; filtered client-side as the user types. */
  options: SearchOption[];
  /** Controlled selected value (display follows it). null clears the selection. */
  value?: string | null;
  /** Initially selected option value. Selection is reported via onValueChange. */
  defaultValue?: string;
  /** Called with the selected option's value. */
  onValueChange?: (value: string) => void;
  placeholder?: string;
  /** Shown when no option matches the query. */
  emptyText?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  'aria-label'?: string;
};

/**
 * Select-with-search: type to filter a full-width dropdown list, or arrow
 * through options from an empty query. Uncontrolled for its display — the
 * selected value is reported through onValueChange (initial selection via
 * defaultValue). The listbox portals to document.body with fixed
 * positioning, so scrollable containers never clip it.
 */
export function Search({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Search…',
  emptyText = 'No matching results',
  disabled,
  id,
  name,
  className,
  'aria-label': ariaLabel,
}: SearchProps) {
  const activeValue = value === undefined ? defaultValue : value ?? undefined;
  const selected = React.useMemo(
    () => options.find((option) => option.value === activeValue),
    [options, activeValue]
  );
  const [query, setQuery] = React.useState(selected?.label ?? '');

  // Controlled usage: follow the parent's value (including external clears).
  React.useEffect(() => {
    if (value !== undefined) setQuery(selected?.label ?? '');
  }, [value, selected]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(q) ||
        option.value.toLowerCase().includes(q) ||
        (option.keywords?.toLowerCase().includes(q) ?? false) ||
        (option.description?.toLowerCase().includes(q) ?? false)
    );
  }, [options, query]);

  const combobox = useCombobox({
    items: filtered,
    onSelect: (item) => {
      setQuery(item.label);
      onValueChange?.(item.value);
    },
  });

  const select = (item: ComboboxItem) => {
    setQuery(item.label);
    onValueChange?.(item.value);
    combobox.setOpen(false);
  };

  return (
    <div ref={combobox.anchorRef} className={cn('relative w-full', className)}>
      <Input
        id={id}
        name={name}
        type="search"
        autoComplete="off"
        aria-label={ariaLabel}
        placeholder={placeholder}
        disabled={disabled}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          combobox.setOpen(true);
        }}
        onFocus={() => {
          // Refocusing a completed selection shows the whole set again.
          if (selected && query === selected.label) setQuery('');
          combobox.setOpen(true);
        }}
        onKeyDown={combobox.onInputKeyDown}
        {...combobox.inputProps}
      />
      {combobox.ready &&
        createPortal(
          <ul
            id={combobox.listboxId}
            role="listbox"
            aria-label={ariaLabel ?? 'Search results'}
            style={{
              position: 'fixed',
              top: combobox.pos!.top,
              left: combobox.pos!.left,
              width: Math.max(combobox.pos!.width, 220),
              zIndex: 50,
            }}
            className="max-h-64 overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
          >
            {filtered.length === 0 ? (
              <li role="presentation" className="px-3 py-2 text-sm text-muted-foreground">
                {emptyText}
              </li>
            ) : (
              filtered.map((option, index) => (
                <li
                  key={option.value}
                  id={combobox.optionId(index)}
                  role="option"
                  aria-selected={combobox.activeIndex === index}
                  // Keep focus on the input so typing continues; select on click.
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => combobox.setActiveIndex(index)}
                  onClick={() => select(option)}
                  className={cn(
                    'cursor-pointer rounded-sm px-3 py-2 text-sm outline-none',
                    combobox.activeIndex === index
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent/60'
                  )}
                >
                  <span className="block">{option.label}</span>
                  {option.description && (
                    <span className="block text-xs text-muted-foreground">{option.description}</span>
                  )}
                </li>
              ))
            )}
          </ul>,
          document.body
        )}
    </div>
  );
}
