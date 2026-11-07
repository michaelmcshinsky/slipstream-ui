'use client';

import { useState } from 'react';
import { FilterPanel, MultiSelect, RangeSlider } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function FilterPanelPage() {
  const [industries, setIndustries] = useState<string[]>(['technology']);
  const [revenue, setRevenue] = useState<[number, number]>([5, 100]);

  return (
    <ComponentPage
      id="filter-panel"
      title="FilterPanel"
      description="Structured filter panel with collapsible sections and reset/apply actions."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'sections', type: 'FilterSection[]', defaultValue: 'required', description: 'Filter groups: title, optional description, content and defaultOpen.' },
        { name: 'title', type: 'string', defaultValue: "'Filters'", description: 'Panel heading.' },
        { name: 'description', type: 'string', description: 'Supporting copy under the panel heading.' },
        { name: 'onReset', type: '() => void', description: 'Reset action shown in the footer.' },
        { name: 'onApply', type: '() => void', description: 'Apply action shown in the footer.' },
        { name: 'resetLabel', type: 'string', defaultValue: "'Reset'", description: 'Reset button label.' },
        { name: 'applyLabel', type: 'string', defaultValue: "'Apply'", description: 'Apply button label.' },
        { name: 'collapsible', type: 'boolean', defaultValue: 'true', description: 'Allow sections to collapse.' },
        { name: 'defaultOpen', type: 'string[]', description: 'Section titles open on first render.' },
        { name: 'actions', type: 'ReactNode', description: 'Extra footer content.' },
        { name: 'as', type: "'div' | 'aside' | 'section'", defaultValue: "'div'", description: 'Semantic element.' },
      ]}
      accessibility={[
        'Each section header is a button with aria-expanded and aria-controls.',
        'Panel title is h2 and section titles are h3.',
      ]}
    >
      <DemoCard
        title="Deal filters"
        preview={
          <div className="w-full max-w-sm">
            <FilterPanel
              title="Deal filters"
              description="Narrow the deal set."
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
  title="Deal filters"
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
    </ComponentPage>
  );
}
