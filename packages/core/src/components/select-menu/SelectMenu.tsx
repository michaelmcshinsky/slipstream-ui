'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

export type SelectMenuItem = {
  value: string;
  label: string;
  /** Muted supporting line under the label. */
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  /** Section heading the item renders under. */
  group?: string;
};

export type SelectMenuProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'defaultValue' | 'onChange' | 'children' | 'type'
> & {
  items: SelectMenuItem[];
  /** Selected value(s): a string, or string[] when multiple. */
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  /** Allow choosing several items (the listbox stays open). */
  multiple?: boolean;
  placeholder?: string;
  /** Name for hidden form inputs (renders one input per selected value). */
  name?: string;
  /** Custom trigger content for the current selection. */
  renderValue?: (selected: SelectMenuItem[]) => React.ReactNode;
  /** Custom option row. */
  renderItem?: (item: SelectMenuItem, state: { selected: boolean; active: boolean }) => React.ReactNode;
  emptyText?: string;
};

function useOutsideClose(open: boolean, close: () => void, refs: Array<React.RefObject<HTMLElement | null>>) {
  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (refs.some((ref) => ref.current?.contains(target))) return;
      close();
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open, close, refs]);
}

/**
 * Custom dropdown select for rich options: descriptions, icons, grouped
 * headings, multi-select and custom row rendering. Unlike `Select` (native
 * `<select>`), this renders a real listbox, so option content is not limited
 * to text. Keyboard model follows the button/listbox pattern: arrows move the
 * active option, Home/End jump, Enter/Space selects, Escape closes, and
 * first-letter typeahead jumps to matching options.
 */
export const SelectMenu = React.forwardRef<HTMLButtonElement, SelectMenuProps>(function SelectMenu(
  {
    items,
    value,
    defaultValue,
    onValueChange,
    multiple = false,
    placeholder = 'Select…',
    name,
    renderValue,
    renderItem,
    emptyText = 'No options',
    className,
    disabled,
    onKeyDown,
    ...buttonProps
  },
  ref
) {
  const [internal, setInternal] = React.useState<string[]>(() => {
    if (defaultValue === undefined) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  });
  const selectedValues = React.useMemo(() => {
    if (value === undefined) return internal;
    return Array.isArray(value) ? value : [value];
  }, [value, internal]);

  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [position, setPosition] = React.useState<{ top: number; left: number; width: number } | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const listboxId = React.useId();
  const labelId = React.useId();
  const typeahead = React.useRef({ query: '', at: 0 });

  const setTriggerRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  const close = React.useCallback(() => setOpen(false), []);
  useOutsideClose(open, close, [triggerRef, listRef]);

  const measure = React.useCallback(() => {
    const node = triggerRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setPosition({ top: rect.bottom + 4, left: rect.left, width: Math.max(rect.width, 200) });
  }, []);

  React.useEffect(() => {
    if (!open) return;
    measure();
    const onScroll = () => measure();
    window.addEventListener('resize', onScroll);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open, measure]);

  // Index of the first enabled option for initial highlight.
  const firstEnabled = React.useMemo(() => items.findIndex((item) => !item.disabled), [items]);

  const openMenu = () => {
    if (disabled) return;
    setOpen(true);
    const selectedIndex = items.findIndex((item) => selectedValues.includes(item.value) && !item.disabled);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : firstEnabled);
  };

  const commit = (next: string[]) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(multiple ? next : next[0] ?? '');
  };

  const select = (item: SelectMenuItem) => {
    if (item.disabled) return;
    if (multiple) {
      const next = selectedValues.includes(item.value)
        ? selectedValues.filter((entry) => entry !== item.value)
        : [...selectedValues, item.value];
      commit(next);
      return;
    }
    commit([item.value]);
    setOpen(false);
  };

  const move = (direction: 1 | -1) => {
    if (items.length === 0) return;
    let index = activeIndex;
    for (let step = 0; step < items.length; step += 1) {
      index = (index + direction + items.length) % items.length;
      if (!items[index]?.disabled) {
        setActiveIndex(index);
        return;
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openMenu();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(firstEnabled);
        break;
      case 'End': {
        event.preventDefault();
        for (let i = items.length - 1; i >= 0; i -= 1) {
          if (!items[i]?.disabled) {
            setActiveIndex(i);
            break;
          }
        }
        break;
      }
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (activeIndex >= 0 && items[activeIndex]) select(items[activeIndex]);
        break;
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        break;
      case 'Tab':
        setOpen(false);
        break;
      default: {
        if (event.key.length !== 1 || event.metaKey || event.ctrlKey || event.altKey) return;
        const now = Date.now();
        const buffer = now - typeahead.current.at > 600 ? event.key : typeahead.current.query + event.key;
        typeahead.current = { query: buffer, at: now };
        const query = buffer.toLowerCase();
        const index = items.findIndex((item) => !item.disabled && item.label.toLowerCase().startsWith(query));
        if (index >= 0) setActiveIndex(index);
      }
    }
  };

  const selectedItems = items.filter((item) => selectedValues.includes(item.value));
  const triggerContent = renderValue ? (
    renderValue(selectedItems)
  ) : selectedItems.length === 0 ? (
    <span className="text-muted-foreground">{placeholder}</span>
  ) : multiple ? (
    <span className="truncate">
      {selectedItems.length === 1 ? selectedItems[0].label : `${selectedItems.length} selected`}
    </span>
  ) : (
    <span className="truncate">{selectedItems[0].label}</span>
  );

  const activeOptionId = activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;

  // Group headings, keeping the flat index aligned with `items`.
  const rows = React.useMemo(() => {
    const out: Array<{ heading?: string; item?: SelectMenuItem; index: number }> = [];
    let lastGroup: string | undefined;
    items.forEach((item, index) => {
      if (item.group && item.group !== lastGroup) {
        out.push({ heading: item.group, index: -1 });
        lastGroup = item.group;
      }
      out.push({ item, index });
    });
    return out;
  }, [items]);

  return (
    <>
      <span id={labelId} className="sr-only">
        {typeof buttonProps['aria-label'] === 'string' ? buttonProps['aria-label'] : 'Select'}
      </span>
      {name &&
        selectedValues.map((selected) => (
          <input key={selected} type="hidden" name={name} value={selected} />
        ))}
      <button
        ref={setTriggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={open ? activeOptionId : undefined}
        aria-labelledby={labelId}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-left text-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...buttonProps}
      >
        <span className="min-w-0 flex-1">{triggerContent}</span>
        <span aria-hidden="true" className="text-muted-foreground">▾</span>
      </button>

      {open &&
        position &&
        createPortal(
          <div
            ref={listRef}
            id={listboxId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={labelId}
            aria-multiselectable={multiple || undefined}
            style={{
              position: 'fixed',
              top: position.top,
              left: position.left,
              width: position.width,
              zIndex: 50,
            }}
            className="max-h-64 overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
          >
            {items.length === 0 ? (
              <p role="presentation" className="px-3 py-2 text-sm text-muted-foreground">
                {emptyText}
              </p>
            ) : (
              rows.map((row, rowIndex) =>
                row.heading ? (
                  <p
                    key={`heading-${row.heading}-${rowIndex}`}
                    role="presentation"
                    className="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    {row.heading}
                  </p>
                ) : (
                  <div
                    key={row.item!.value}
                    id={`${listboxId}-option-${row.index}`}
                    role="option"
                    aria-selected={selectedValues.includes(row.item!.value)}
                    aria-disabled={row.item!.disabled || undefined}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => !row.item!.disabled && setActiveIndex(row.index)}
                    onClick={() => select(row.item!)}
                    className={cn(
                      'flex cursor-pointer items-start gap-2 rounded-sm px-3 py-2 text-sm outline-none',
                      row.index === activeIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/60',
                      row.item!.disabled && 'pointer-events-none opacity-50'
                    )}
                  >
                    {renderItem ? (
                      renderItem(row.item!, {
                        selected: selectedValues.includes(row.item!.value),
                        active: row.index === activeIndex,
                      })
                    ) : (
                      <>
                        {row.item!.icon && <span className="mt-0.5 shrink-0 [&_svg]:size-4">{row.item!.icon}</span>}
                        <span className="min-w-0 flex-1">
                          <span className="block">{row.item!.label}</span>
                          {row.item!.description && (
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {row.item!.description}
                            </span>
                          )}
                        </span>
                        {multiple && selectedValues.includes(row.item!.value) && (
                          <span aria-hidden="true" className="ml-auto text-primary">
                            ✓
                          </span>
                        )}
                      </>
                    )}
                  </div>
                )
              )
            )}
          </div>,
          document.body
        )}
    </>
  );
});
