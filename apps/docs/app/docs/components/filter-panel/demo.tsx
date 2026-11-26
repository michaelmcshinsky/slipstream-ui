'use client';

import { useState } from 'react';
import { FilterPanel, MultiSelect, RangeSlider } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  const [industries, setIndustries] = useState<string[]>(['technology']);
  const [revenue, setRevenue] = useState<[number, number]>([5, 100]);

  return (
    <>
      <DemoCard
        title="Project filters"
        preview={
          <div className="w-full max-w-sm">
            <FilterPanel
              title="Project filters"
              description="Narrow the project set."
              onReset={() => {
                setIndustries([]);
                setRevenue([5, 100]);
              }}
              onApply={() => {}}
              sections={[
                {
                  title: 'Industry',
                  content: (
                    <MultiSelect
                      label="Industry"
                      value={industries}
                      onValueChange={setIndustries}
                      options={[
                        { value: 'technology', label: 'Technology' },
                        { value: 'healthcare', label: 'Healthcare' },
                        { value: 'industrials', label: 'Industrials' },
                      ]}
                    />
                  ),
                  defaultOpen: true,
                },
                {
                  title: 'Revenue',
                  content: (
                    <RangeSlider
                      min={5}
                      max={100}
                      step={5}
                      value={revenue}
                      onValueChange={setRevenue}
                      startLabel="Revenue minimum"
                      endLabel="Revenue maximum"
                      formatValue={(value) => `$${value}M`}
                    />
                  ),
                },
              ]}
            />
          </div>
        }
        code={`<FilterPanel
  title="Project filters"
  onReset={reset}
  onApply={apply}
  sections={[
    { title: 'Industry', content: <MultiSelect ... />, defaultOpen: true },
    { title: 'Revenue', content: <RangeSlider ... /> },
  ]}
/>`}
        usage={`// FilterPanel owns disclosure and footer actions, not filter values.
// Put it in a sidebar on desktop and a Drawer on mobile.`}
        types={`type FilterSection = {
  title: string;
  description?: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
};

type FilterPanelProps = {
  sections: FilterSection[];
  title?: string;
  description?: string;
  onReset?: () => void;
  onApply?: () => void;
  resetLabel?: string;
  applyLabel?: string;
  collapsible?: boolean;
  defaultOpen?: string[];
  actions?: React.ReactNode;
  as?: 'div' | 'aside' | 'section';
};`}
      />
    </>
  );
}
