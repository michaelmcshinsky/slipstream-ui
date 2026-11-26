'use client';

import { useState } from 'react';
import { MultiSelect } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  const [industries, setIndustries] = useState<string[]>(['technology']);

  return (
    <>
      <DemoCard
        title="Industry filter"
        preview={
          <div className="w-full max-w-sm">
            <MultiSelect
              label="Industry"
              value={industries}
              onValueChange={setIndustries}
              options={[
                { value: 'technology', label: 'Technology', group: 'Sectors' },
                { value: 'healthcare', label: 'Healthcare', group: 'Sectors' },
                { value: 'industrials', label: 'Industrials', description: 'Manufacturing and distribution', group: 'Sectors' },
                { value: 'business-services', label: 'Business services', group: 'Sectors' },
              ]}
            />
            <p className="mt-3 text-sm text-muted-foreground">
              Selected: {industries.join(', ') || 'None'}
            </p>
          </div>
        }
        code={`<MultiSelect
  label="Industry"
  value={industries}
  onValueChange={setIndustries}
  options={[
    { value: 'technology', label: 'Technology', group: 'Sectors' },
    { value: 'healthcare', label: 'Healthcare', group: 'Sectors' },
  ]}
/>`}
        usage={`// Chips stay outside the trigger so they can be removed independently.
// Select all and Clear stay in the panel footer.`}
        types={`type MultiSelectOption = {
  value: string;
  label: string;
  description?: string;
  group?: string;
  disabled?: boolean;
};

type MultiSelectProps = {
  options: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (values: string[]) => void;
  label?: string;
  triggerLabel?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  maxDisplay?: number;
  disabled?: boolean;
};`}
      />
    </>
  );
}
