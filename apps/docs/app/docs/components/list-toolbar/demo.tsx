'use client';

import { useState } from 'react';
import { ListToolbar, SegmentedControl, Select } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('date');

  return (
    <DemoCard
      title="Directory result bar"
      preview={
        <div className="w-full max-w-2xl">
          <ListToolbar
            count={42}
            countLabel="events"
            position="Page 2 of 5"
            note="Sorted by date, soonest first"
          >
            <SegmentedControl
              aria-label="View"
              value={view}
              onValueChange={(value) => setView(value as string)}
              options={[
                { value: 'grid', label: 'Grid' },
                { value: 'list', label: 'List' },
              ]}
            />
            <Select
              label="Sort"
              labelHidden
              className="h-9"
              value={sort}
              onValueChange={(next) => setSort(next as string)}
              options={[
                { value: 'date', label: 'Date' },
                { value: 'name', label: 'Name' },
              ]}
            />
          </ListToolbar>
          <p className="mt-2 text-sm text-muted-foreground">
            view: <code className="text-foreground">{view}</code> · sort:{' '}
            <code className="text-foreground">{sort}</code>
          </p>
        </div>
      }
      code={`<ListToolbar
  count={events.length}
  countLabel="events"
  position={\`Page \${page} of \${pages}\`}
  note="Sorted by date, soonest first"
>
  <SegmentedControl
    aria-label="View"
    value={view}
    onValueChange={setView}
    options={[
      { value: 'grid', label: 'Grid' },
      { value: 'list', label: 'List' },
    ]}
  />
  <Select label="Sort" labelHidden className="h-9" options={sortOptions} value={sort} onValueChange={setSort} />
</ListToolbar>`}
      usage={`// ListToolbar sits between FilterBar (inputs) and the results:
// count + position + sort note on the left, view switch and sort on the right.
// For URL-backed view switching, give SegmentedControl options an href.`}
      types={`type ListToolbarProps = {
  count?: number;
  countLabel?: string;            // default "results"
  position?: React.ReactNode;     // "Page 2 of 5", "Showing 21–40 of 137"
  note?: React.ReactNode;         // "Sorted by date, soonest first"
  align?: 'between' | 'start' | 'center' | 'end';  // default 'between'
  children?: React.ReactNode;     // view switch, sort control
};`}
    />
  );
}
