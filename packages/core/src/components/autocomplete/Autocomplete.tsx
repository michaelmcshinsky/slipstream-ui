'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { Input } from '../input/Input';
import { useCombobox } from '../search/use-combobox';

export interface AutocompleteProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'children' | 'size'
  > {
  /** Current text — standard controlled-input contract. */
  value?: string;
  /** Initial text when uncontrolled. */
  defaultValue?: string;
  /** Fires on every keystroke AND on suggestion selection (like a native input's onChange). */
  onValueChange?: (value: string) => void;
  /** Suggestion labels offered while typing; any value may still be entered free-form. */
  suggestions: string[];
  /** Shown when no suggestion matches (optional). */
  emptyText?: string;
}

/**
 * Type-ahead input following the HTML autocomplete model: users may enter
 * any value (free text is first-class), while matching suggestions appear
 * in a listbox — Arrow keys highlight, Enter accepts, Escape dismisses.
 * The native `autoComplete` attribute passes through (form autofill hints
 * keep working alongside the custom listbox). The listbox portals with
 * fixed positioning so scrollable containers never clip it.
 */
export function Autocomplete({
  value,
  defaultValue = '',
  onValueChange,
  suggestions,
  emptyText,
  placeholder,
  id,
  name,
  className,
  onKeyDown,
  onFocus,
  ...inputProps
}: AutocompleteProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const current = value ?? internalValue;

  const items = React.useMemo(() => {
    const q = current.trim().toLowerCase();
    const list = q
      ? suggestions.filter((suggestion) => suggestion.toLowerCase().includes(q))
      : suggestions;
    // Never offer the exact current value back as a suggestion.
    return list
      .filter((suggestion) => suggestion !== current)
      .map((suggestion) => ({ value: suggestion, label: suggestion }));
  }, [suggestions, current]);

  const combobox = useCombobox({
    items,
    onSelect: (item) => {
      if (value === undefined) setInternalValue(item.label);
      onValueChange?.(item.label);
    },
  });

  const select = (label: string) => {
    if (value === undefined) setInternalValue(label);
    onValueChange?.(label);
    combobox.setOpen(false);
  };

  return (
    <div ref={combobox.anchorRef} className={cn('relative w-full', className)}>
      <Input
        id={id}
        name={name}
        placeholder={placeholder}
        autoComplete="off"
        value={current}
        onChange={(event) => {
          if (value === undefined) setInternalValue(event.target.value);
          onValueChange?.(event.target.value);
          combobox.setOpen(true);
        }}
        onFocus={(event) => {
          onFocus?.(event);
          combobox.setOpen(true);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          combobox.onInputKeyDown(event);
        }}
        {...inputProps}
        {...combobox.inputProps}
      />
      {combobox.ready &&
        createPortal(
          <ul
            id={combobox.listboxId}
            role="listbox"
            aria-label="Suggestions"
            style={{
              position: 'fixed',
              top: combobox.pos!.top,
              left: combobox.pos!.left,
              width: Math.max(combobox.pos!.width, 220),
              zIndex: 50,
            }}
            className="max-h-60 overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
          >
            {items.length === 0 ? (
              <li role="presentation" className="px-3 py-2 text-sm text-muted-foreground">
                {emptyText ?? 'No suggestions'}
              </li>
            ) : (
              items.map((item, index) => (
                <li
                  key={item.value}
                  id={combobox.optionId(index)}
                  role="option"
                  aria-selected={combobox.activeIndex === index}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => combobox.setActiveIndex(index)}
                  onClick={() => select(item.label)}
                  className={cn(
                    'cursor-pointer rounded-sm px-3 py-1.5 text-sm outline-none',
                    combobox.activeIndex === index
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent/60'
                  )}
                >
                  {item.label}
                </li>
              ))
            )}
          </ul>,
          document.body
        )}
    </div>
  );
}
