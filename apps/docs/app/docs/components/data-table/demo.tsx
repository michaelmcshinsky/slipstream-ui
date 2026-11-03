'use client';

import { useState } from 'react';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Badge, DataTable, Switch, type DataTableColumn } from '@slipstream-ui/core';

interface Conversation {
  id: string;
  title: string;
  messages: number;
  status: 'live' | 'archived' | 'failed';
  updatedAt: string;
}

const CONVERSATIONS: Conversation[] = [
  { id: 'c1', title: 'MCP manifest sync', messages: 42, status: 'live', updatedAt: '2026-10-28' },
  { id: 'c2', title: 'RAG citations demo', messages: 17, status: 'archived', updatedAt: '2026-10-21' },
  { id: 'c3', title: 'Streaming edge cases', messages: 96, status: 'live', updatedAt: '2026-10-30' },
  { id: 'c4', title: 'PromptInput attachments', messages: 8, status: 'failed', updatedAt: '2026-10-12' },
  { id: 'c5', title: 'Branch navigation UX', messages: 31, status: 'archived', updatedAt: '2026-10-05' },
  { id: 'c6', title: 'Tool-call error cards', messages: 55, status: 'live', updatedAt: '2026-10-29' },
  { id: 'c7', title: 'Welcome suggestions tuning', messages: 12, status: 'live', updatedAt: '2026-10-26' },
];

const COLUMNS: DataTableColumn<Conversation>[] = [
  { key: 'title', header: 'Conversation', sortable: true },
  {
    key: 'status',
    header: 'Status',
    cell: (row) => (
      <Badge variant={row.status === 'failed' ? 'destructive' : row.status === 'live' ? 'default' : 'outline'}>
        {row.status}
      </Badge>
    ),
  },
  { key: 'messages', header: 'Messages', align: 'right', sortable: true },
  { key: 'updatedAt', header: 'Updated', sortable: true, align: 'right' },
];

export default function DataTablePage() {
  const [clicked, setClicked] = useState<string | null>(null);
  const [cellClick, setCellClick] = useState<string | null>(null);
  const [loadingDemo, setLoadingDemo] = useState(false);

  return (
    <ComponentPage
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
        { name: 'density', type: "'default' | 'compact'", defaultValue: "'default'", description: 'Row density — compact shrinks text and cell padding.' },
        { name: 'zebra', type: 'boolean', defaultValue: 'false', description: 'Zebra-striped rows for long tables.' },
        { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Render skeleton rows; tbody is aria-busy while loading.' },
        { name: 'columns[].onClick', type: '(row: T) => void', description: 'Column-level callback — the cell content renders as a keyboard-operable button.' },
      ]}
      accessibility={[
        'Sortable headers expose aria-sort (ascending/descending/none) and toggle via a real button.',
        'Native <caption> names the table; headers are th[scope=col].',
        'With onRowClick rows are tabIndex=0 and activate on Enter/Space — still provide an in-cell link as the primary path.',
        'The result count is aria-live=polite; pagination reuses Pagination (aria-current=page).',
      ]}
      browserNotes={[
        'Table markup and sorting are baseline; no newer CSS is required.',
      ]}
    >
      <DemoCard
        title="Sortable + paginated"
        preview={
          <div className="w-full space-y-3">
            <DataTable
              caption="Recent conversations"
              columns={COLUMNS}
              data={CONVERSATIONS}
              rowId={(row) => row.id}
              pageSize={4}
              onRowClick={(row) => setClicked(row.title)}
            />
            <p className="text-xs text-muted-foreground">
              Clicked row:{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono">{clicked ?? 'none yet'}</code>{' '}
              — click headers to sort, or Tab to a row and press Enter.
            </p>
          </div>
        }
        code={`import { Badge, DataTable, type DataTableColumn } from '@slipstream-ui/core';

type Conversation = { id: string; title: string; messages: number; status: 'live' | 'archived' | 'failed'; updatedAt: string };

const columns: DataTableColumn<Conversation>[] = [
  { key: 'title', header: 'Conversation', sortable: true },
  { key: 'status', header: 'Status', cell: (row) => (
    <Badge variant={row.status === 'failed' ? 'destructive' : 'outline'}>{row.status}</Badge>
  ) },
  { key: 'messages', header: 'Messages', align: 'right', sortable: true },
  { key: 'updatedAt', header: 'Updated', align: 'right', sortable: true },
];

<DataTable
  caption="Recent conversations"
  columns={columns}
  data={conversations}
  rowId={(row) => row.id}
  pageSize={10}
  onRowClick={(row) => router.push(\`/c/\${row.id}\`)}
/>`}
        usage={`// One config prop describes the whole table: shape, sorting, paging, rows.
<DataTable
  columns={columns}
  data={rows}
  rowId={(row) => row.id}
  pageSize={25}
/>

// Server-side ordering: controlled sort + your fetch
<DataTable
  columns={columns}
  data={rows}
  rowId={(row) => row.id}
  sortKey={sort.key}
  sortDir={sort.dir}
  onSortChange={(key, dir) => fetchSorted(key, dir)}
/>`}
        types={`interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  cell?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowId: (row: T) => string;
  caption?: string;
  defaultSort?: { key: string; dir: 'asc' | 'desc' } | null;
  sortKey?: string | null;
  sortDir?: 'asc' | 'desc';
  onSortChange?: (key: string, dir: 'asc' | 'desc') => void;
  pageSize?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}`}
      />

      <DemoCard
        title="Empty state + no sort"
        preview={
          <div className="w-full">
            <DataTable
              caption="Failed runs"
              columns={COLUMNS}
              data={[]}
              rowId={(row) => row.id}
              emptyMessage="No failed runs in this window."
            />
          </div>
        }
        code={`<DataTable
  columns={columns}
  data={[]}
  rowId={(row) => row.id}
  emptyMessage="No failed runs in this window."
/>`}
      />

      <DemoCard
        title="Custom icons · density · zebra · loading · cell callbacks"
        preview={
          <div className="w-full space-y-4">
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <Switch
                checked={loadingDemo}
                onCheckedChange={setLoadingDemo}
                aria-label="Toggle loading state"
              />
              loading (skeleton rows + aria-busy)
            </label>
            <DataTable
              caption="Advanced config in one props object"
              columns={[
                {
                  key: 'title',
                  header: 'Title',
                  sortable: true,
                  // Column-level callback: the cell renders as a button.
                  onClick: (row) => setCellClick(row.title),
                },
                { key: 'messages', header: 'Messages', align: 'right', sortable: true },
                {
                  key: 'status',
                  header: 'Status',
                  cell: (row) => (
                    <Badge variant={row.status === 'failed' ? 'destructive' : row.status === 'live' ? 'default' : 'outline'}>
                      {row.status}
                    </Badge>
                  ),
                },
                { key: 'updatedAt', header: 'Updated', align: 'right' },
              ]}
              data={CONVERSATIONS}
              rowId={(row) => row.id}
              zebra
              density="compact"
              loading={loadingDemo}
              renderSortIcon={(state) => (state === 'none' ? '⇅' : state === 'asc' ? '↑' : '↓')}
            />
            <p className="text-xs text-muted-foreground">
              Title cell clicked:{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono">{cellClick ?? 'none yet'}</code>{' '}
              — click a Title cell (its own onClick), or sort with the custom ↑/↓/⇅ icons.
            </p>
          </div>
        }
        code={`<DataTable
  columns={[
    { key: 'title', header: 'Title', sortable: true,
      onClick: (row) => open(row) },          // cell becomes a button
    { key: 'messages', header: 'Messages', align: 'right', sortable: true },
    { key: 'status', header: 'Status',
      cell: (row) => <Badge variant={tone(row.status)}>{row.status}</Badge> },
  ]}
  data={rows}
  rowId={(row) => row.id}
  zebra
  density="compact"
  loading={isLoading}
  renderSortIcon={(s) => (s === 'none' ? '⇅' : s === 'asc' ? '↑' : '↓')}
/>`}
        usage={`// Server-side sort: onSortChange fires on every header toggle while
// DataTable keeps aria-sort honest — fetch and replace data yourself.
<DataTable
  columns={columns}
  data={serverRows}
  rowId={(row) => row.id}
  sortKey={sort.key}
  sortDir={sort.dir}
  onSortChange={(key, dir) => fetchSorted(key, dir)}
/>

// Sticky header: give the wrapper a height
<DataTable … stickyHeader className="max-h-[480px] overflow-y-auto" />`}
      />
    </ComponentPage>
  );
}
