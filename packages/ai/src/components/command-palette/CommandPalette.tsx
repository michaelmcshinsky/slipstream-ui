'use client';

import * as React from 'react';
import { cn } from '@slipstream-ui/core';

export type Command = {
  id: string;
  label: string;
  /** Optional grouping header, e.g. "Navigation". */
  section?: string;
  /** Extra lexical search terms. */
  keywords?: string[];
  shortcut?: string;
  /** Optional leading icon (rendered by the default row or renderCommand). */
  icon?: React.ReactNode;
  /** Optional secondary line in the default row. */
  description?: string;
};

export type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Static command set (ignored for filtering when loadCommands is set). */
  commands: Command[];
  onSelect: (command: Command) => void;
  /** Async source; called with the current query (debounced). */
  loadCommands?: (query: string) => Promise<Command[]>;
  /** Debounce for loadCommands, in ms. Default 200. */
  debounceMs?: number;
  /** Custom row renderer (icons, type badges, metadata). */
  renderCommand?: (command: Command, state: { active: boolean }) => React.ReactNode;
  /** Shown while async commands load. */
  loadingText?: string;
  placeholder?: string;
};

/**
 * Cmd+K command palette: combobox + listbox with aria-activedescendant
 * keyboard navigation, lexical filtering over label/keywords, and
 * Escape-to-close. No focus leaves the input while navigating.
 */
export function CommandPalette({
  open,
  onOpenChange,
  commands,
  onSelect,
  loadCommands,
  debounceMs = 200,
  renderCommand,
  loadingText = 'Searching…',
  placeholder = 'Type a command.',
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [asyncCommands, setAsyncCommands] = React.useState<Command[]>([]);
  const [loading, setLoading] = React.useState(false);
  const requestId = React.useRef(0);
  const asyncSignature = loadCommands ? String(loadCommands.length) : '';
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listboxId = React.useId();
  const optionId = (index: number) => `${listboxId}-option-${index}`;

  React.useEffect(() => {
    if (!open || !loadCommands) return;
    const id = ++requestId.current;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const result = await loadCommands(query);
        if (requestId.current === id) setAsyncCommands(result);
      } catch {
        if (requestId.current === id) setAsyncCommands([]);
      } finally {
        if (requestId.current === id) setLoading(false);
      }
    }, debounceMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, query, debounceMs, asyncSignature]);

  const filtered = React.useMemo(() => {
    if (loadCommands) return asyncCommands;
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return commands;
    return commands.filter((command) => {
      const haystack = `${command.label} ${command.section ?? ''} ${(command.keywords ?? []).join(' ')}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [commands, query, asyncCommands, loadCommands]);

  React.useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      // Focus after paint so the portal/DOM node exists.
      const timer = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open]);

  React.useEffect(() => {
    setActiveIndex((index) => Math.min(index, Math.max(0, filtered.length - 1)));
  }, [filtered.length]);

  if (!open) return null;

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onOpenChange(false);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (filtered.length === 0 ? 0 : (index + 1) % filtered.length));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (filtered.length === 0 ? 0 : (index - 1 + filtered.length) % filtered.length));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const command = filtered[activeIndex];
      if (command) {
        onSelect(command);
        onOpenChange(false);
      }
    }
  };

  let lastSection: string | undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 p-4 pt-[15vh]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onOpenChange(false);
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={listboxId}
          aria-activedescendant={filtered.length > 0 ? optionId(activeIndex) : undefined}
          aria-autocomplete="list"
          aria-label="Command palette"
          placeholder={placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={onKeyDown}
          className="w-full border-b border-border bg-transparent px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring placeholder:text-muted-foreground"
        />
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Commands"
          aria-busy={loading || undefined}
          className="max-h-72 overflow-y-auto py-1"
        >
          {loading && filtered.length === 0 && (
            <li role="presentation" className="px-4 py-3 text-sm text-muted-foreground">
              {loadingText}
            </li>
          )}
          {!loading && filtered.length === 0 && (
            <li role="presentation" className="px-4 py-3 text-sm text-muted-foreground">
              No matching commands.
            </li>
          )}
          {filtered.map((command, index) => {
            const showSection = command.section && command.section !== lastSection;
            lastSection = command.section ?? lastSection;
            return (
              <React.Fragment key={command.id}>
                {showSection && (
                  <li role="presentation" className="px-4 pb-1 pt-3 text-xs font-medium uppercase text-muted-foreground">
                    {command.section}
                  </li>
                )}
                <li
                  id={optionId(index)}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    onSelect(command);
                    onOpenChange(false);
                  }}
                  className={cn(
                    'flex cursor-pointer items-center justify-between px-4 py-2 text-sm',
                    index === activeIndex ? 'bg-primary/10 text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {renderCommand ? (
                    renderCommand(command, { active: index === activeIndex })
                  ) : (
                    <>
                      <span className="flex min-w-0 items-center gap-2">
                        {command.icon && <span className="shrink-0 [&_svg]:size-4">{command.icon}</span>}
                        <span className="min-w-0">
                          <span className="block truncate">{command.label}</span>
                          {command.description && (
                            <span className="block text-xs text-muted-foreground">{command.description}</span>
                          )}
                        </span>
                      </span>
                      {command.shortcut && <span className="font-mono text-xs">{command.shortcut}</span>}
                    </>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
