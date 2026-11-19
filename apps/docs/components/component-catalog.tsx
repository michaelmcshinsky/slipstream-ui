'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Input } from '@slipstream-ui/core';
import { countCatalog, filterCatalog, type CatalogGroup } from '@/lib/component-catalog';

/**
 * Search-first component catalog. Everything is filtered in the browser from
 * the same nav + registry data the sidebar uses, so a component cannot appear
 * in one place and be missing from the other.
 */
export function ComponentCatalog({ groups, total }: { groups: CatalogGroup[]; total: number }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => filterCatalog(groups, query, category), [category, groups, query]);
  const count = countCatalog(filtered);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="component-filter" className="mb-1.5 block text-sm font-medium">
            Find a component
          </label>
          <Input
            id="component-filter"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try “table”, “streaming”, “dialog”, or “agent”"
            aria-describedby="component-filter-count"
          />
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
          <button
            type="button"
            aria-pressed={category === 'all'}
            onClick={() => setCategory('all')}
            className={`rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
              category === 'all'
                ? 'border-primary/40 bg-primary/10 font-medium text-primary'
                : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            All {total}
          </button>
          {groups.map((group) => (
            <button
              key={group.title}
              type="button"
              aria-pressed={category === group.title}
              onClick={() => setCategory(group.title)}
              className={`rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
                category === group.title
                  ? 'border-primary/40 bg-primary/10 font-medium text-primary'
                  : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {group.title}
            </button>
          ))}
        </div>
      </div>

      <p id="component-filter-count" role="status" className="mb-6 text-sm text-muted-foreground">
        {count} component{count === 1 ? '' : 's'}
        {query.trim() ? ` matching “${query.trim()}”` : ''}
      </p>

      {count === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <p className="font-medium">No component matches that search.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a broader term, or use the command palette{' '}
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">Ctrl K</kbd> to search
            docs, guides and manifests together.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {filtered.map((group) => (
            <section key={group.title}>
              <h2 className="mb-1 text-2xl font-semibold">{group.title}</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                {group.items.length} component{group.items.length === 1 ? '' : 's'}
              </p>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold">{item.label}</h3>
                      {item.tier && (
                        <span className="shrink-0 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {item.tier}
                        </span>
                      )}
                    </div>
                    {item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
