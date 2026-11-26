import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/data-table', {
  title: 'DataTable',
  description:
    'Config-driven table: one component plus a columns config that owns shape, sorting, pagination, and row interaction.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('data-table')}
      id="data-table"
      title="DataTable"
      description="Config-driven table: one component plus a columns config that owns shape, sorting, pagination, and row interaction."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'columns', type: 'DataTableColumn<T>[]', defaultValue: 'required', description: 'Column config: key, header, optional cell renderer, sortable, align, className.' },
        { name: 'data', type: 'T[]', defaultValue: 'required', description: 'Row data.' },
        { name: 'rowId', type: '(row: T) => string', defaultValue: 'required', description: 'Stable id per row (React key + test hooks).' },
        { name: 'caption', type: 'string', description: 'Accessible table caption.' },
        { name: 'defaultSort', type: '{ key: string; dir: "asc" | "desc" } | null', description: 'Initial sort when uncontrolled.' },
        { name: 'sortKey / sortDir', type: 'string | null / "asc" | "desc"', description: 'Controlled sort (pair with onSortChange for server-side ordering).' },
        { name: 'onSortChange', type: '(key: string, dir: "asc" | "desc") => void', description: 'Fires when a sortable header is toggled.' },
        { name: 'pageSize', type: 'number', description: 'Rows per page; enables pagination and the result count.' },
        { name: 'page / onPageChange', type: 'number / (page: number) => void', description: 'Controlled pagination when pageSize is set.' },
        { name: 'onRowClick', type: '(row: T) => void', description: 'Makes rows keyboard-focusable (Enter/Space) with a visible ring.' },
        { name: 'emptyMessage', type: 'string', defaultValue: "'No results.'", description: 'Shown when data is empty.' },
        { name: 'renderSortIcon', type: "(state: 'none' | 'asc' | 'desc') => ReactNode", description: 'Replace the default ▲/▼/↕ header glyphs with custom markup.' },
        { name: 'stickyHeader', type: 'boolean', defaultValue: 'false', description: 'Pin the header while the body scrolls (pair with a max-height on className).' },
        { name: 'density', type: "'default' | 'compact'", defaultValue: "'default'", description: 'Row density: compact shrinks text and cell padding.' },
        { name: 'selectedRowIds / onSelectedRowIdsChange', type: 'string[] / (ids: string[]) => void', description: 'Controlled row selection; presence enables the checkbox column.' },
        { name: 'isRowSelectable', type: '(row: T) => boolean', description: 'Excludes rows from selection (renders a disabled checkbox).' },
        { name: 'bulkActions', type: 'ReactNode', description: 'Toolbar rendered above the table while rows are selected.' },
        { name: 'selectAllLabel / selectedLabel', type: 'string', defaultValue: "'Select all rows'", description: 'Localized select-all and selection-count copy.' },
        { name: 'pageCount / total / manualPagination', type: 'number / number / boolean', description: 'Server-side pagination: pageCount or total drives the pager when manualPagination is set.' },
        { name: 'zebra', type: 'boolean', defaultValue: 'false', description: 'Zebra-striped rows for long tables.' },
        { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Render skeleton rows; tbody is aria-busy while loading.' },
        { name: 'loadingRows', type: 'number', defaultValue: 'page size (else 5)', description: 'Skeleton row count: match it to visible data so replacing placeholders does not shift the table. Row heights follow density.' },
        { name: 'columns[].onClick', type: '(row: T) => void', description: 'Column-level callback: the cell content renders as a keyboard-operable button.' },
      ]}
      accessibility={[
        'Sortable headers expose aria-sort (ascending/descending/none) and toggle via a real button.',
        'Native <caption> names the table; headers are th[scope=col].',
        'With onRowClick rows are tabIndex=0 and activate on Enter/Space: still provide an in-cell link as the primary path.',
        'The result count is aria-live=polite; pagination reuses Pagination (aria-current=page).',
      ]}
      browserNotes={[
        'Table markup and sorting are baseline; no newer CSS is required.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
