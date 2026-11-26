'use client';

import { useState } from 'react';
import { SegmentedControl } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  const [audience, setAudience] = useState('teams');
  const [types, setTypes] = useState<string[]>(['integration']);

  return (
    <>
      <DemoCard
        title="Audience filter"
        preview={
          <div className="flex w-full flex-col gap-6">
            <div>
              <p className="mb-2 text-sm font-medium">Audience (single select)</p>
              <SegmentedControl
                aria-label="Audience"
                value={audience}
                onValueChange={(value) => setAudience(value as string)}
                options={[
                  { value: 'teams', label: 'Teams' },
                  { value: 'analysts', label: 'Analysts' },
                  { value: 'admins', label: 'Admins' },
                ]}
              />
              <p className="mt-2 text-sm text-muted-foreground">Selected: {audience}</p>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Report type (multi select)</p>
              <SegmentedControl
                aria-label="Report type"
                multiple
                value={types}
                onValueChange={(value) => setTypes(value as string[])}
                options={[
                  { value: 'integration', label: 'Integration' },
                  { value: 'analytics', label: 'Analytics' },
                  { value: 'reporting', label: 'Reporting' },
                ]}
              />
              <p className="mt-2 text-sm text-muted-foreground">Selected: {types.join(', ') || 'None'}</p>
            </div>
          </div>
        }
        code={`<SegmentedControl
  aria-label="Audience"
  value={audience}
  onValueChange={(value) => setAudience(value as string)}
  options={[
    { value: 'teams', label: 'Teams' },
    { value: 'analysts', label: 'Analysts' },
    { value: 'admins', label: 'Admins' },
  ]}
/>

<SegmentedControl
  aria-label="Report type"
  multiple
  value={types}
  onValueChange={(value) => setTypes(value as string[])}
  options={reportTypes}
/>`}
        usage={`// Single-select: one string. Multi-select: string[].
// Use SegmentedControl for filters, Tabs for tabpanels.
// Arrow keys move single-select; Home/End jump to the ends.`}
        types={`type SegmentedOption = {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  href?: string;
};

type SegmentedControlProps = {
  options: SegmentedOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  multiple?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  linkComponent?: React.ElementType;
  linkHrefProp?: 'href' | 'to';
};`}
      />
      <DemoCard
        title="Density, full width and icons"
        preview={
          <div className="flex w-full flex-col gap-6">
            <SegmentedControl
              aria-label="View size"
              size="sm"
              value="comfortable"
              onValueChange={() => {}}
              options={[
                { value: 'compact', label: 'Compact' },
                { value: 'comfortable', label: 'Comfortable' },
                { value: 'spacious', label: 'Spacious', disabled: true },
              ]}
            />
            <SegmentedControl
              aria-label="Layout"
              fullWidth
              value="grid"
              onValueChange={() => {}}
              options={[
                { value: 'grid', label: 'Grid', icon: <span aria-hidden>grid</span> },
                { value: 'list', label: 'List', icon: <span aria-hidden>list</span> },
              ]}
            />
          </div>
        }
        code={`<SegmentedControl
  aria-label="View size"
  size="sm"
  value={density}
  onValueChange={setDensity}
  options={[
    { value: 'compact', label: 'Compact' },
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'spacious', label: 'Spacious', disabled: true },
  ]}
/>

<SegmentedControl
  aria-label="Layout"
  fullWidth
  value={layout}
  onValueChange={setLayout}
  options={[
    { value: 'grid', label: 'Grid', icon: <GridIcon /> },
    { value: 'list', label: 'List', icon: <ListIcon /> },
  ]}
/>`}
        usage={`// size="sm" for toolbars; fullWidth stretches segments edge to edge.
// icon accepts any ReactNode and pairs with a text label.
// Give an option href to render it as a link for URL-backed view switches.`}
      />
      <DemoCard
        title="URL-backed view switch"
        preview={
          <SegmentedControl
            aria-label="Listing view"
            value="grid"
            options={[
              { value: 'list', label: 'List', href: '?view=list' },
              { value: 'grid', label: 'Grid', href: '?view=grid' },
            ]}
          />
        }
        code={`<SegmentedControl
  aria-label="Listing view"
  value={view}
  options={[
    { value: 'list', label: 'List', href: '?view=list' },
    { value: 'grid', label: 'Grid', href: '?view=grid' },
  ]}
/>`}
        usage={`// Options with href render real links: the view survives refresh,
// works without JavaScript, and stays cacheable. The active segment
// becomes an aria-current="page" marker. Use linkComponent/linkHrefProp
// for client-side routers. Intended for single-select.`}
      />
    </>
  );
}
