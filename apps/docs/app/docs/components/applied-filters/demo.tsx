'use client';

import { useState } from 'react';
import { AppliedFilters, type FilterChip } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

const INITIAL: FilterChip[] = [
  { key: 'industry', label: 'Industry', value: 'Technology' },
  { key: 'region', label: 'Region', value: 'Mountain' },
  { key: 'revenue', label: 'Revenue', value: '$10M to $50M' },
];

export default function Demo() {
  const [filters, setFilters] = useState(INITIAL);
  const [editHint, setEditHint] = useState(false);

  const remove = (key: string) => setFilters((current) => current.filter((filter) => filter.key !== key));

  return (
    <>
      <DemoCard
        title="Applied filters"
        preview={
          <div className="w-full">
            <AppliedFilters
              filters={filters.map((filter) => ({ ...filter, onRemove: () => remove(filter.key) }))}
              onClearAll={() => setFilters([])}
              onEdit={() => setEditHint(true)}
              emptyLabel="No filters applied"
            />
            {editHint && (
              <p className="mt-2 text-xs text-muted-foreground" role="status">
                Edit filters clicked — in a real app this opens the filter panel (e.g. a Drawer on mobile).
              </p>
            )}
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
    </>
  );
}
