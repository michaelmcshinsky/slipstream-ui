'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@slipstream-ui/i18n/react';
import { SEARCH_INDEX, type SearchEntry } from '@/lib/search-index';
import { filterSearch } from '@/lib/search';
import { track } from '@/lib/analytics';

const LISTBOX_ID = 'site-command-palette-listbox';
const optionId = (index: number) => `site-command-palette-option-${index}`;

/**
 * ⌘K command palette (mantine/shadcn style): fuzzy search over docs,
 * keyboard-first navigation, grouped results.
 */
export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo<SearchEntry[]>(() => filterSearch(SEARCH_INDEX, query), [query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl+K is owned by the navbar, which mounts this component.
      if (event.key === 'Escape' && open) onOpenChange(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setQuery('');
    setActiveIndex(0);
    // Focus after paint so the modal is mounted, and restore the trigger on
    // close/unmount so keyboard users are not dropped on <body>.
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => previouslyFocused?.focus();
  }, [open]);

  const go = useCallback(
    (href: string) => {
      track('search_select', { href, query: query.trim() || '(browse)' });
      onOpenChange(false);
      router.push(href);
    },
    [onOpenChange, query, router]
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) =>
        results.length === 0 ? 0 : Math.min(index + 1, results.length - 1),
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter' && results[activeIndex]) {
      go(results[activeIndex].href);
    }
  };

  const onDialogKeyDown = (event: React.KeyboardEvent) => {
    // The palette is a single-focus combobox: keep Tab inside the dialog so
    // focus cannot escape to the page behind the overlay.
    if (event.key === 'Tab') {
      event.preventDefault();
      inputRef.current?.focus();
    }
  };

  const activeOptionId =
    results.length > 0 && activeIndex >= 0 && activeIndex < results.length
      ? optionId(activeIndex)
      : undefined;

  useEffect(() => {
    const active = listRef.current?.querySelector('[data-active="true"]');
    if (active instanceof HTMLElement && typeof active.scrollIntoView === 'function') {
      active.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/50 pt-[12vh] backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('site.search.dialogLabel')}
        className="w-full max-w-lg rounded-xl border border-border bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={onDialogKeyDown}
      >
        {/* No overflow-hidden on the dialog: the input's focus ring follows
            its own rounded-t corners instead of being clipped at the
            dialog's corner radius. */}
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded="true"
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls={results.length > 0 ? LISTBOX_ID : undefined}
          aria-activedescendant={activeOptionId}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={onKeyDown}
          placeholder={t('site.search.placeholder')}
          aria-label={t('site.search.inputLabel')}
          className="w-full rounded-t-xl border-b border-border bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        />
        <div
          ref={listRef}
          id={LISTBOX_ID}
          className="max-h-80 overflow-y-auto p-2"
          role={results.length > 0 ? 'listbox' : undefined}
          aria-label={results.length > 0 ? t('site.search.resultsLabel') : undefined}
        >
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              {t('site.search.noResults', { query })}
            </p>
          ) : (
            results.map((result, index) => (
              <div
                key={result.href}
                id={optionId(index)}
                role="option"
                aria-selected={index === activeIndex}
                data-active={index === activeIndex}
                onClick={() => go(result.href)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  index === activeIndex ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                <span className="font-medium">{result.title}</span>
                <span className="text-xs text-muted-foreground line-clamp-1">{result.group}</span>
              </div>
            ))
          )}
        </div>
        <div className="flex items-center gap-4 rounded-b-xl border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
          <span>{t('site.search.navigate')}</span>
          <span>{t('site.search.open')}</span>
          <span className="ml-auto">{t('site.search.close')}</span>
        </div>
      </div>
    </div>
  );
}
