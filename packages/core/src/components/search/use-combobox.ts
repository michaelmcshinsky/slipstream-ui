import * as React from 'react';

export type ComboboxItem = {
  value: string;
  label: string;
};

type UseComboboxOptions = {
  /** Currently visible items (already filtered by the query). */
  items: ComboboxItem[];
  /** Called with the chosen item (mouse or Enter). */
  onSelect: (item: ComboboxItem) => void;
  /** Called whenever open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Close when the value is submitted with no active item (Enter). Default true. */
  closeOnSubmit?: boolean;
};

type UseComboboxResult = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeIndex: number;
  /** Hover/highlight management for the listbox options. */
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  listboxId: string;
  /** Anchors the floating listbox — measured for fixed positioning. */
  anchorRef: React.MutableRefObject<HTMLDivElement | null>;
  /** aria-* props to spread on the input (combobox pattern). */
  inputProps: {
    role: 'combobox';
    'aria-expanded': boolean;
    'aria-controls': string;
    'aria-autocomplete': 'list';
    'aria-activedescendant'?: string;
  };
  /** Key handler for the input: arrows, Home/End, Enter, Escape. */
  onInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Downward movement for trigger buttons outside the input (optional). */
  optionId: (index: number) => string;
  /** True when the listbox should be rendered (open + measured). */
  ready: boolean;
  /** Fixed viewport coordinates for the listbox. */
  pos: { top: number; left: number; width: number } | null;
};

let searchUid = 0;

/**
 * Shared combobox brain for Search and Autocomplete: open/close, active
 * option, keyboard navigation, outside-click dismissal, and fixed-position
 * measurement (so demo frames with overflow never clip the listbox).
 */
export function useCombobox({
  items,
  onSelect,
  onOpenChange,
  closeOnSubmit = true,
}: UseComboboxOptions): UseComboboxResult {
  const [open, setOpenState] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [pos, setPos] = React.useState<{ top: number; left: number; width: number } | null>(null);
  const anchorRef = React.useRef<HTMLDivElement | null>(null);
  const listboxId = React.useRef(`slipstream-combobox-${++searchUid}`).current;

  const setOpen = React.useCallback(
    (next: boolean) => {
      setOpenState(next);
      if (!next) setActiveIndex(-1);
      onOpenChange?.(next);
    },
    [onOpenChange]
  );

  // Reset the active item whenever the visible set changes.
  React.useEffect(() => {
    setActiveIndex(-1);
  }, [items]);

  // Measure the anchor for fixed listbox positioning while open; close on
  // any scroll (capture catches non-bubbling element scrolls) so the
  // floating list never detaches from its input.
  React.useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const GAP = 4;
    const measure = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPos({ top: rect.bottom + GAP, left: rect.left, width: rect.width });
    };
    measure();
    const onScroll = () => setOpen(false);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', measure);
    };
  }, [open, setOpen]);

  // Dismiss on outside press (the input keeps focus for continued typing).
  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!anchorRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, setOpen]);

  const onInputKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        setActiveIndex((index) => (items.length === 0 ? -1 : index >= items.length - 1 ? 0 : index + 1));
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (!open) return;
        setActiveIndex((index) => (items.length === 0 ? -1 : index <= 0 ? items.length - 1 : index - 1));
        return;
      }
      if (event.key === 'Home' && open) {
        event.preventDefault();
        setActiveIndex(items.length ? 0 : -1);
        return;
      }
      if (event.key === 'End' && open) {
        event.preventDefault();
        setActiveIndex(items.length ? items.length - 1 : -1);
        return;
      }
      if (event.key === 'Enter') {
        if (open && activeIndex >= 0 && items[activeIndex]) {
          event.preventDefault();
          onSelect(items[activeIndex]);
          setOpen(false);
        } else if (open && closeOnSubmit) {
          setOpen(false);
        }
      }
    },
    [open, items, activeIndex, onSelect, setOpen, closeOnSubmit]
  );

  return {
    open,
    setOpen,
    activeIndex,
    setActiveIndex,
    listboxId,
    anchorRef,
    inputProps: {
      role: 'combobox',
      'aria-expanded': open,
      'aria-controls': listboxId,
      'aria-autocomplete': 'list',
      ...(open && activeIndex >= 0 ? { 'aria-activedescendant': `${listboxId}-opt-${activeIndex}` } : {}),
    },
    onInputKeyDown,
    optionId: (index: number) => `${listboxId}-opt-${index}`,
    ready: open && pos !== null && typeof document !== 'undefined',
    pos,
  };
}
