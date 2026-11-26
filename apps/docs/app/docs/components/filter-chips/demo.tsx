'use client';

import { useState } from 'react';
import { FilterChips, type FilterChip } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

const INITIAL: FilterChip[] = [
  { key: 'industry', label: 'Industry', value: 'Technology' },
  { key: 'region', label: 'Region', value: 'Mountain' },
  { key: 'revenue', label: 'Revenue', value: '$10M to $50M' },
];

export default function Demo() {
  const [filters, setFilters] = useState(INITIAL);

  const remove = (key: string) => setFilters((current) => current.filter((filter) => filter.key !== key));

  return (
    <>
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
  size?: 'sm' | 'md' | 'lg';
  onClearAll?: () => void;
  clearLabel?: string;
  emptyLabel?: string;
};`}
      />

      <DemoCard
        title="Sizes"
        preview={
          <div className="space-y-4">
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <FilterChips
                key={size}
                size={size}
                filters={[
                  { key: 'industry', label: 'Industry', value: 'Technology' },
                  { key: 'region', label: 'Region', value: 'Mountain' },
                ]}
              />
            ))}
          </div>
        }
        code={`<FilterChips size="sm" filters={filters} />
<FilterChips size="md" filters={filters} />
<FilterChips size="lg" filters={filters} />`}
        usage={`// Pick the scale that matches the density of the surrounding toolbar.
// Chips, their remove icons and the clear-all action scale together.`}
      />
    </>
  );
}
