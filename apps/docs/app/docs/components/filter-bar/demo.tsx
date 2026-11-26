'use client';

import { useState } from 'react';
import { FilterBar, Select } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const active = (query ? 1 : 0) + (status !== 'all' ? 1 : 0);

  return (
    <>
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
                labelHidden
                className="h-9"
                value={status}
                onValueChange={(next) => setStatus(next as string)}
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
  <Select label="Status" labelHidden className="h-9" options={statusOptions} value={status} onValueChange={setStatus} />
</FilterBar>`}
        usage={`// FilterBar narrows results; creation actions belong in PageHeader actions.
// Omit onSearchChange to use the bar for selects only.
// labelHidden keeps a control's name for screen readers without pushing the
// select below the search field, so the row stays on one baseline.`}
        types={`type FilterBarProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onReset?: () => void;
  activeCount?: number;
  onOpenFilters?: () => void;
  filtersLabel?: string;
  resultsCount?: number;
  resultsLabel?: string;
  trailing?: React.ReactNode;
};`}
      />
    </>
  );
}
