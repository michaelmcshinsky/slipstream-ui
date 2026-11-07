'use client';

import { useState } from 'react';
import { FilterChips, type FilterChip } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

const INITIAL: FilterChip[] = [
  { key: 'industry', label: 'Industry', value: 'Technology' },
  { key: 'region', label: 'Region', value: 'Mountain' },
  { key: 'revenue', label: 'Revenue', value: '$10M to $50M' },
];

export default function FilterChipsPage() {
  const [filters, setFilters] = useState(INITIAL);

  const remove = (key: string) => setFilters((current) => current.filter((filter) => filter.key !== key));

  return (
    <ComponentPage
      id="filter-chips"
      title="FilterChips"
      description="Active-filter summary with removable chips and a clear-all action."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'filters', type: 'FilterChip[]', defaultValue: 'required', description: 'Active filters: key, label, optional value and onRemove.' },
        { name: 'onClearAll', type: '() => void', description: 'Shows a clear-all action when provided.' },
        { name: 'clearLabel', type: 'string', defaultValue: "'Clear all'", description: 'Label for the clear-all action.' },
        { name: 'emptyLabel', type: 'string', description: 'Shown when there are no active filters. Nothing renders when omitted.' },
      ]}
      accessibility={[
        'Renders a named group (Active filters by default) so the summary has a landmark-like label.',
        'Each remove control is named Remove <filter>: <value>.',
      ]}
    >
      <DemoCard
        title="Applied filters"
        preview={
          <div className="w-full">
            <FilterChips
              filters={filters.map((filter) => ({ ...filter, onRemove: () => remove(filter.key) }))}
              onClearAll={() => setFilters([])}
              emptyLabel="No filters applied"
            />
          </div>
        }
        code={`<FilterChips
  filters={[
    { key: 'industry', label: 'Industry', value: 'Technology', onRemove: () => remove('industry') },
    { key: 'region', label: 'Region', value: 'Mountain', onRemove: () => remove('region') },
  ]}
  onClearAll={clearAll}
/>`}
        usage={`// Filters need stable keys.
// onRemove is optional, so a read-only summary can omit it.
// emptyLabel renders when the list is empty; otherwise nothing renders.`}
        types={`type FilterChip = {
  key: string;
  label: string;
  value?: string;
  onRemove?: () => void;
};

type FilterChipsProps = {
  filters: FilterChip[];
  onClearAll?: () => void;
  clearLabel?: string;
  emptyLabel?: string;
};`}
      />
    </ComponentPage>
  );
}
