'use client';

import { useState } from 'react';
import { FilterBar, Select } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function FilterBarPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const active = (query ? 1 : 0) + (status !== 'all' ? 1 : 0);

  return (
    <ComponentPage
      id="filter-bar"
      title="FilterBar"
      description="List-page filter strip: search field, filter controls, reset affordance and trailing actions."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'searchValue', type: 'string', description: 'Controlled search text.' },
        { name: 'onSearchChange', type: '(value: string) => void', description: 'Fires on each keystroke; hides the search box when omitted.' },
        { name: 'searchPlaceholder', type: 'string', defaultValue: "'Search…'", description: 'Search placeholder (also its accessible name).' },
        { name: 'onReset', type: '() => void', description: 'Shows a reset button when provided.' },
        { name: 'activeCount', type: 'number', defaultValue: '0', description: 'Active filter count appended to the reset label.' },
        { name: 'trailing', type: 'ReactNode', description: 'Far-right actions (bulk actions, column settings).' },
      ]}
      accessibility={['role=search wraps the controls; the search input is labelled by its placeholder.', 'Reset is a normal button with an updated accessible name.']}
    >
      <DemoCard
        title="List filters (interactive)"
        preview={
          <div className="w-full space-y-3">
            <FilterBar
              searchValue={query}
              onSearchChange={setQuery}
              searchPlaceholder="Search students"
              activeCount={active}
              onReset={() => {
                setQuery('');
                setStatus('all');
              }}
            >
              <Select
                label="Status"
                value={status}
                onChange={(next) => setStatus(next as string)}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'active', label: 'Active' },
                  { value: 'paused', label: 'Paused' },
                ]}
              />
            </FilterBar>
            <p className="text-sm text-muted-foreground">
              query: <code className="text-foreground">{query || '—'}</code> · status:{' '}
              <code className="text-foreground">{status}</code>
            </p>
          </div>
        }
        code={`<FilterBar
  searchValue={query}
  onSearchChange={setQuery}
  searchPlaceholder="Search students"
  onReset={resetFilters}
  activeCount={activeFilters}
>
  <Select label="Status" options={statusOptions} value={status} onChange={setStatus} />
</FilterBar>`}
        usage={`// FilterBar narrows results; creation actions belong in PageHeader actions.
// Omit onSearchChange to use the bar for selects only.`}
        types={`type FilterBarProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onReset?: () => void;
  activeCount?: number;
  trailing?: React.ReactNode;
};`}
      />
    </ComponentPage>
  );
}
