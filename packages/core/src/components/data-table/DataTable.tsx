'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { Pagination } from '../pagination/Pagination';
import { Skeleton } from '../skeleton/Skeleton';
import { Checkbox } from '../checkbox/Checkbox';

export type DataTableColumn<T> = {
  /** Unique column key; also the value passed to onSortChange when sortable. */
  key: string;
  /** Header cell content. */
  header: React.ReactNode;
  /**
   * Cell renderer. Defaults to reading `row[key]` (nullish values render
   * as an em dash).
   */
  cell?: (row: T, index: number) => React.ReactNode;
  /** Enables a sort toggle on this column's header. */
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  /** Extra classes for the th/td cells (e.g. 'w-40', 'hidden sm:table-cell'). */
  className?: string;
  /** Per-cell click callback — the cell content renders as a button. */
  onClick?: (row: T) => void;
};

export type SortIconState = 'none' | 'asc' | 'desc';

export type DataTableProps<T> = {
  /** Column configuration — everything about the table's shape. */
  columns: DataTableColumn<T>[];
  /** Row data. */
  data: T[];
  /** Stable id per row (React key + test hooks). */
  rowId: (row: T) => string;
  /** Accessible table caption (visible; pass captionHidden styling to hide). */
  caption?: string;
  /** Initial sort (uncontrolled). Omit for no initial sort. */
  defaultSort?: { key: string; dir: 'asc' | 'desc' } | null;
  /** Controlled sort. */
  sortKey?: string | null;
  sortDir?: 'asc' | 'desc';
  /**
   * Fires when the sort changes (controlled or not) — wire it to a server
   * query to sort at the database while DataTable renders aria-sort.
   */
  onSortChange?: (key: string, dir: 'asc' | 'desc') => void;
  /** Replace the default ▲/▼/↕ header glyphs. */
  renderSortIcon?: (state: SortIconState) => React.ReactNode;
  /** Rows per page; enables pagination when set. */
  pageSize?: number;
  /** Controlled page (1-based) when pageSize is set. */
  page?: number;
  /** Total page count (manual/server pagination). */
  pageCount?: number;
  /** Total row count across all pages (summary + derived page count). */
  total?: number;
  /** Server pagination: render `data` as-is; don't slice or sort client-side. */
  manualPagination?: boolean;
  /** Selected row ids (controlled). Enables the leading selection column. */
  selectedRowIds?: string[];
  /** Fires with the full selection after a row or select-all toggle. */
  onSelectedRowIdsChange?: (ids: string[]) => void;
  /** Disable selection for individual rows. */
  isRowSelectable?: (row: T) => boolean;
  /** Rendered above the table while at least one row is selected. */
  bulkActions?: React.ReactNode;
  /** Fires on page change (controlled or not). */
  onPageChange?: (page: number) => void;
  /** Click/keyboard activation on a row. */
  onRowClick?: (row: T) => void;
  /** Message shown when data is empty. */
  emptyMessage?: string;
  /** Accessible label for the select-all checkbox (default "Select all rows"). */
  selectAllLabel?: string;
  /** Pin the header while the body scrolls (needs a max-height on the wrapper via className). */
  stickyHeader?: boolean;
  /** Compact row density. */
  density?: 'default' | 'compact';
  /** Zebra-striped rows. */
  zebra?: boolean;
  /** Render skeleton placeholder rows (announced via aria-busy). */
  loading?: boolean;
  /**
   * Skeleton row count while loading (defaults to the page size, else 5).
   * Match it to your visible data length so rows don't jump when real
   * data replaces the placeholders.
   */
  loadingRows?: number;
  className?: string;
};

type SortState = { key: string; dir: 'asc' | 'desc' } | null;

function compareValues(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  const an = a == null ? '' : String(a);
  const bn = b == null ? '' : String(b);
  return an.localeCompare(bn, undefined, { numeric: true, sensitivity: 'base' });
}

/**
 * Config-driven table: one component + a `columns` config that owns shape,
 * sorting, pagination, and row interaction. Built-in sorting toggles with
 * aria-sort, cursor pagination when `pageSize` is set, and a friendly empty
 * state — so most tables never need hand-rolled table code.
 */
export function DataTable<T>({
  columns,
  data,
  rowId,
  caption,
  defaultSort = null,
  sortKey,
  sortDir,
  onSortChange,
  renderSortIcon,
  pageSize,
  page,
  onPageChange,
  pageCount: pageCountProp,
  total,
  manualPagination = false,
  selectedRowIds,
  onSelectedRowIdsChange,
  isRowSelectable,
  bulkActions,
  onRowClick,
  emptyMessage = 'No results.',
  selectAllLabel = 'Select all rows',
  stickyHeader,
  density = 'default',
  zebra,
  loading,
  loadingRows,
  className,
}: DataTableProps<T>) {
  const [internalSort, setInternalSort] = React.useState<SortState>(defaultSort);
  const [internalPage, setInternalPage] = React.useState(1);

  const sort = React.useMemo<SortState>(() => {
    if (sortKey !== undefined) {
      return sortKey === null ? null : { key: sortKey, dir: sortDir ?? 'asc' };
    }
    return internalSort;
  }, [sortKey, sortDir, internalSort]);
  const currentPage = page ?? internalPage;

  const applySort = (key: string) => {
    const nextDir: 'asc' | 'desc' = sort?.key === key && sort.dir === 'asc' ? 'desc' : 'asc';
    if (sortKey === undefined) setInternalSort({ key, dir: nextDir });
    onSortChange?.(key, nextDir);
    if (pageSize && currentPage !== 1) setPage(1);
  };

  const setPage = (next: number) => {
    if (page === undefined) setInternalPage(next);
    onPageChange?.(next);
  };

  const sorted = React.useMemo(() => {
    if (!sort) return data;
    const column = columns.find((c) => c.key === sort.key);
    if (!column) return data;
    const read = (row: T): unknown =>
      column.cell ? undefined : (row as unknown as Record<string, unknown>)[column.key];
    // When a custom cell renders the value, fall back to the raw key access
    // for sorting — configs should keep row data addressable by column.key.
    const copy = [...data];
    copy.sort((a, b) => {
      const cmp = compareValues(
        (a as unknown as Record<string, unknown>)[column.key] ?? read(a),
        (b as unknown as Record<string, unknown>)[column.key] ?? read(b)
      );
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [data, sort, columns]);

  const effectiveTotal = total ?? sorted.length;
  const computedPageCount = pageSize ? Math.max(1, Math.ceil(effectiveTotal / pageSize)) : 0;
  const pageCount = pageCountProp ?? computedPageCount;
  const safePage = Math.min(currentPage, pageCount || 1);
  const visible = manualPagination
    ? data
    : pageSize
      ? sorted.slice((safePage - 1) * pageSize, safePage * pageSize)
      : sorted;

  // ----- Row selection (controlled or uncontrolled) -----
  const [internalSelected, setInternalSelected] = React.useState<string[]>([]);
  const selectionEnabled = selectedRowIds !== undefined || onSelectedRowIdsChange !== undefined;
  const selectedIds = selectedRowIds ?? internalSelected;
  const selectedSet = React.useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectableVisible = isRowSelectable ? visible.filter(isRowSelectable) : visible;
  const allSelected = selectableVisible.length > 0 && selectableVisible.every((row) => selectedSet.has(rowId(row)));
  const someSelected = selectableVisible.some((row) => selectedSet.has(rowId(row)));

  const commitSelection = (next: string[]) => {
    if (selectedRowIds === undefined) setInternalSelected(next);
    onSelectedRowIdsChange?.(next);
  };
  const toggleAll = () => {
    if (allSelected) {
      const visibleIds = new Set(selectableVisible.map((row) => rowId(row)));
      commitSelection(selectedIds.filter((id) => !visibleIds.has(id)));
      return;
    }
    const merged = new Set([...selectedIds, ...selectableVisible.map((row) => rowId(row))]);
    commitSelection([...merged]);
  };
  const toggleRow = (id: string) => {
    commitSelection(selectedSet.has(id) ? selectedIds.filter((entry) => entry !== id) : [...selectedIds, id]);
  };

  const cellValue = (row: T, column: DataTableColumn<T>, index: number): React.ReactNode => {
    if (column.cell) return column.cell(row, index);
    const raw = (row as unknown as Record<string, unknown>)[column.key];
    if (raw == null) return '—';
    if (typeof raw === 'string' || typeof raw === 'number') return raw;
    return String(raw);
  };

  const alignClass = (align?: DataTableColumn<T>['align']) =>
    align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={cn('w-full space-y-3', className)}>
      {selectionEnabled && selectedIds.length > 0 && bulkActions && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
          <span className="font-medium">{selectedIds.length} selected</span>
          <div className="flex flex-wrap items-center gap-2">{bulkActions}</div>
        </div>
      )}
      <div className="w-full overflow-x-auto rounded-lg border border-border">
        <table
          className={cn('w-full caption-bottom', density === 'compact' ? 'text-xs' : 'text-sm')}
        >
          {caption && <caption className="px-3 py-2 text-left text-xs text-muted-foreground">{caption}</caption>}
          <thead className={cn('bg-muted/50', stickyHeader && 'sticky top-0 z-10 bg-background')}>
            <tr>
              {selectionEnabled && (
                <th scope="col" className="w-10 border-b border-border px-3 py-2">
                  <Checkbox
                    aria-label={selectAllLabel}
                    checked={allSelected}
                    ref={(node) => {
                      if (node) node.indeterminate = someSelected && !allSelected;
                    }}
                    onCheckedChange={toggleAll}
                  />
                </th>
              )}
              {columns.map((column) => {
                const isSorted = sort?.key === column.key;
                const ariaSort = !column.sortable
                  ? undefined
                  : isSorted
                    ? sort!.dir === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none';
                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className={cn(
                      'border-b border-border px-3 py-2 font-medium',
                      alignClass(column.align),
                      column.className
                    )}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => applySort(column.key)}
                        className="inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {column.header}
                        <span aria-hidden="true" className="text-[10px] text-muted-foreground">
                          {renderSortIcon
                            ? renderSortIcon(isSorted ? (sort!.dir === 'asc' ? 'asc' : 'desc') : 'none')
                            : isSorted
                              ? sort!.dir === 'asc'
                                ? '▲'
                                : '▼'
                              : '↕'}
                        </span>
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody aria-busy={loading || undefined}>
            {loading ? (
              Array.from(
                { length: (loadingRows ?? pageSize ?? Math.min(visible.length, 5)) || 5 },
                (_, skeletonRow) => (
                  <tr key={`skeleton-${skeletonRow}`}>
                    {selectionEnabled && (
                      <td className={cn('px-3 py-2', density === 'compact' && 'px-2 py-1')}>
                        <Skeleton className="h-4 w-4" />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={column.key} className={cn('px-3 py-2', density === 'compact' && 'px-2 py-1')}>
                        {/* Height tracks density so skeleton rows match real row
                            height and replacing them doesn't shift the table. */}
                        <Skeleton className={density === 'compact' ? 'h-3 w-full' : 'h-4 w-full'} />
                      </td>
                    ))}
                  </tr>
                )
              )
            ) : visible.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectionEnabled ? 1 : 0)}
                  className="px-3 py-8 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              visible.map((row, index) => (
                <tr
                  key={rowId(row)}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={
                    onRowClick
                      ? (event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            onRowClick(row);
                          }
                        }
                      : undefined
                  }
                  className={cn(
                    'border-b border-border last:border-0',
                    zebra && '[&:nth-child(odd)]:bg-muted/30',
                    onRowClick &&
                      'cursor-pointer transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring'
                  )}
                >
                  {selectionEnabled && (
                    <td
                      className={cn('align-middle', density === 'compact' ? 'px-2 py-1' : 'px-3 py-2')}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Checkbox
                        aria-label={`Select row ${rowId(row)}`}
                        checked={selectedSet.has(rowId(row))}
                        disabled={isRowSelectable ? !isRowSelectable(row) : undefined}
                        onCheckedChange={() => toggleRow(rowId(row))}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'align-middle',
                        density === 'compact' ? 'px-2 py-1' : 'px-3 py-2',
                        alignClass(column.align),
                        column.className
                      )}
                    >
                      {column.onClick ? (
                        <button
                          type="button"
                          onClick={() => column.onClick!(row)}
                          className="block w-full rounded px-1.5 py-0.5 text-left transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {cellValue(row, column, index)}
                        </button>
                      ) : (
                        cellValue(row, column, index)
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pageSize && pageCount > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p
            className="min-h-8 leading-none text-xs text-muted-foreground"
            aria-live="polite"
          >
            {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, effectiveTotal)} of{' '}
            {effectiveTotal}
          </p>
          <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
