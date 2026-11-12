'use client';

import { useState } from 'react';
import { SegmentedControl } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function SegmentedControlPage() {
  const [audience, setAudience] = useState('teams');
  const [types, setTypes] = useState<string[]>(['integration']);

  return (
    <ComponentPage
      id="segmented-control"
      title="SegmentedControl"
      description="Single- or multi-select segmented control for view and filter switches."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'options', type: 'SegmentedOption[]', defaultValue: 'required', description: 'Segments to render: value, label, optional icon and disabled.' },
        { name: 'value', type: 'string | string[]', description: 'Controlled selection. Use string[] when multiple.' },
        { name: 'defaultValue', type: 'string | string[]', description: 'Initial selection when uncontrolled.' },
        { name: 'onValueChange', type: '(value: string | string[]) => void', description: 'Fires with the next selection.' },
        { name: 'multiple', type: 'boolean', defaultValue: 'false', description: 'Allow more than one segment to be active.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Control density.' },
        { name: 'fullWidth', type: 'boolean', defaultValue: 'false', description: 'Stretch segments to fill the container width.' },
      ]}
      accessibility={[
        'Single-select uses role=radiogroup/radio with aria-checked and arrow-key navigation.',
        'Multiple uses role=group with aria-pressed on each segment.',
        'Pass aria-label or aria-labelledby; the default name is generic.',
      ]}
    >
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
  onValueChange={setAudience}
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
  onValueChange={setTypes}
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
};

type SegmentedControlProps = {
  options: SegmentedOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  multiple?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
};`}
      />
    </ComponentPage>
  );
}
