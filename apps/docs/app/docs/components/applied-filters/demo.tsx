'use client';

import { useState } from 'react';
import { AppliedFilters, type FilterChip } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

const INITIAL: FilterChip[] = [
  { key: 'industry', label: 'Industry', value: 'Technology' },
  { key: 'region', label: 'Region', value: 'Mountain' },
  { key: 'revenue', label: 'Revenue', value: '$10M to $50M' },
];

export default function AppliedFiltersPage() {
  const [filters, setFilters] = useState(INITIAL);

  const remove = (key: string) => setFilters((current) => current.filter((filter) => filter.key !== key));

  return (
    <ComponentPage
      id="applied-filters"
      title="AppliedFilters"
      description="Applied-filter summary with a live count, removable chips and an edit action."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'filters', type: 'FilterChip[]', defaultValue: 'required', description: 'Active filters to display.' },
        { name: 'onClearAll', type: '() => void', description: 'Clear-all action.' },
        { name: 'onEdit', type: '() => void', description: 'Opens the filter panel for editing.' },
        { name: 'label', type: 'string', description: 'Optional summary text; defaults to N active.' },
        { name: 'emptyLabel', type: 'string', description: 'Shown when there are no filters.' },
        { name: 'editLabel', type: 'string', defaultValue: "'Edit filters'", description: 'Edit action label.' },
      ]}
      accessibility={[
        'The wrapper uses aria-live=polite so count changes are announced.',
        'Remove and clear actions come from FilterChips with named controls.',
      ]}
    >
      <DemoCard
        title="Applied filters"
        preview={
          <div className="w-full">
            <AppliedFilters
              filters={filters.map((filter) => ({ ...filter, onRemove: () => remove(filter.key) }))}
              onClearAll={() => setFilters([])}
              onEdit={() => {}}
              emptyLabel="No filters applied"
            />
          </div>
        }
        code={`<AppliedFilters
  filters={[
    { key: 'industry', label: 'Industry', value: 'Technology', onRemove: remove('industry') },
    { key: 'region', label: 'Region', value: 'Mountain', onRemove: remove('region') },
  ]}
  onClearAll={clearAll}
  onEdit={openPanel}
/>`}
        usage={`// One summary per filter surface.
// onEdit usually opens a FilterPanel in a Drawer on mobile.`}
        types={`type AppliedFiltersProps = {
  filters: FilterChip[];
  onClearAll?: () => void;
  onEdit?: () => void;
  label?: string;
  emptyLabel?: string;
  editLabel?: string;
};`}
      />
    </ComponentPage>
  );
}
