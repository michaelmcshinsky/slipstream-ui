'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { Input } from '../input/Input';
import { useCombobox } from '../search/use-combobox';

export type AutocompleteOption = {
  value: string;
  /** Display label; defaults to the value. */
  label?: string;
  /** Section heading the option renders under. */
  group?: string;
  /** Muted supporting line under the label. */
  description?: string;
};

export type AutocompleteProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'children' | 'size'
> & {
  /** Current text — standard controlled-input contract. */
  value?: string;
  /** Initial text when uncontrolled. */
  defaultValue?: string;
  /** Fires on every keystroke AND on suggestion selection. */
  onValueChange?: (value: string) => void;
  /** Static suggestions (strings or option objects). */
  options?: Array<string | AutocompleteOption>;
  /** @deprecated Use `options`. */
  suggestions?: string[];
  /** Async source; called with the current query (debounced) when provided. */
  loadOptions?: (query: string) => Promise<Array<string | AutocompleteOption>>;
  /** Custom row rendering (receives the normalized option). */
  renderOption?: (option: NormalizedOption, state: { active: boolean }) => React.ReactNode;
  /** Show a clear button once there is text. */
  clearable?: boolean;
  /** Shown when no option matches. */
  emptyText?: string;
  /** Shown while async options load. */
  loadingText?: string;
  /** Debounce for `loadOptions`, in ms. Default 200. */
  debounceMs?: number;
};

type NormalizedOption = {
  value: string;
  label: string;
  group?: string;
  description?: string;
};

function normalize(entry: string | AutocompleteOption): NormalizedOption {
  if (typeof entry === 'string') return { value: entry, label: entry };
  return { value: entry.value, label: entry.label ?? entry.value, group: entry.group, description: entry.description };
}

/**
 * Type-ahead input following the HTML autocomplete model: users may enter
 * any value (free text is first-class), while matching options appear in a
 * portalled listbox (grouped, optional async loading, custom rows).
 * Arrow keys highlight, Enter accepts, Escape dismisses.
 */
export function Autocomplete({
  value,
  defaultValue = '',
  onValueChange,
  options,
  suggestions,
  loadOptions,
  renderOption,
  clearable = false,
  emptyText,
  loadingText,
  debounceMs = 200,
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

  const [asyncOptions, setAsyncOptions] = React.useState<NormalizedOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const requestId = React.useRef(0);

  const source = React.useMemo<NormalizedOption[]>(() => {
    const list = options ?? (suggestions ?? []).map(normalize);
    return list.map(normalize);
  }, [options, suggestions]);

  // Debounced async source. Guarded by a request id so stale responses
  // never overwrite newer ones.
  React.useEffect(() => {
    if (!loadOptions) return;
    const id = ++requestId.current;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const result = await loadOptions(current);
        if (requestId.current === id) setAsyncOptions(result.map(normalize));
      } catch {
        if (requestId.current === id) setAsyncOptions([]);
      } finally {
        if (requestId.current === id) setLoading(false);
      }
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [loadOptions, current, debounceMs]);

  const pool = loadOptions ? asyncOptions : source;

  const items = React.useMemo(() => {
    const q = current.trim().toLowerCase();
    return pool
      .filter((option) => !q || option.label.toLowerCase().includes(q) || option.value.toLowerCase().includes(q))
      .filter((option) => option.value !== current);
  }, [pool, current]);

  const combobox = useCombobox({
    items: items.map((item) => ({ value: item.value, label: item.label })),
    onSelect: (item) => {
      if (value === undefined) setInternalValue(item.label);
      onValueChange?.(item.label);
    },
  });

  const select = (option: NormalizedOption) => {
    if (value === undefined) setInternalValue(option.label);
    onValueChange?.(option.label);
    combobox.setOpen(false);
  };

  // Render order with group headings derived from the option stream.
  const grouped = React.useMemo(() => {
    const out: Array<{ heading?: string; option?: NormalizedOption; index: number }> = [];
    let lastGroup: string | undefined;
    items.forEach((option, index) => {
      if (option.group && option.group !== lastGroup) {
        out.push({ heading: option.group, index: -1 });
        lastGroup = option.group;
      }
      out.push({ option, index });
    });
    return out;
  }, [items]);

  return (
    <div ref={combobox.anchorRef} className={cn('relative w-full', className)}>
      <Input
        id={id}
        name={name}
        placeholder={placeholder}
        autoComplete="off"
        value={current}
        className={clearable && current ? 'pr-9' : undefined}
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
      {clearable && current && (
        <button
          type="button"
          onClick={() => {
            if (value === undefined) setInternalValue('');
            onValueChange?.('');
            combobox.setOpen(true);
          }}
          aria-label="Clear input"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          ✕
        </button>
      )}
      {combobox.ready &&
        createPortal(
          <ul
            id={combobox.listboxId}
            role="listbox"
            aria-label="Suggestions"
            aria-busy={loading || undefined}
            style={{
              position: 'fixed',
              top: combobox.pos!.top,
              left: combobox.pos!.left,
              width: Math.max(combobox.pos!.width, 220),
              zIndex: 50,
            }}
            className="max-h-60 overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
          >
            {loading && items.length === 0 ? (
              <li role="presentation" className="px-3 py-2 text-sm text-muted-foreground">
                {loadingText ?? 'Loading…'}
              </li>
            ) : items.length === 0 ? (
              <li role="presentation" className="px-3 py-2 text-sm text-muted-foreground">
                {emptyText ?? 'No suggestions'}
              </li>
            ) : (
              grouped.map((entry, rowIndex) =>
                entry.heading ? (
                  <li
                    key={`group-${entry.heading}-${rowIndex}`}
                    role="presentation"
                    className="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    {entry.heading}
                  </li>
                ) : (
                  <li
                    key={entry.option!.value}
                    id={combobox.optionId(entry.index)}
                    role="option"
                    aria-selected={combobox.activeIndex === entry.index}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => combobox.setActiveIndex(entry.index)}
                    onClick={() => select(entry.option!)}
                    className={cn(
                      'cursor-pointer rounded-sm px-3 py-1.5 text-sm outline-none',
                      combobox.activeIndex === entry.index
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent/60'
                    )}
                  >
                    {renderOption ? (
                      renderOption(entry.option!, { active: combobox.activeIndex === entry.index })
                    ) : (
                      <>
                        <span className="block">{entry.option!.label}</span>
                        {entry.option!.description && (
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {entry.option!.description}
                          </span>
                        )}
                      </>
                    )}
                  </li>
                )
              )
            )}
          </ul>,
          document.body
        )}
    </div>
  );
}
