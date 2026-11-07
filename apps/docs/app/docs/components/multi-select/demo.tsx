'use client';

import { useState } from 'react';
import { MultiSelect } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function MultiSelectPage() {
  const [industries, setIndustries] = useState<string[]>(['technology']);

  return (
    <ComponentPage
      id="multi-select"
      title="MultiSelect"
      description="Searchable multi-select filter with visible removable chips and a checkbox panel."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'options', type: 'MultiSelectOption[]', defaultValue: 'required', description: 'Options: value, label, optional description, group and disabled.' },
        { name: 'value', type: 'string[]', description: 'Controlled selected values.' },
        { name: 'defaultValue', type: 'string[]', description: 'Initial selected values when uncontrolled.' },
        { name: 'onValueChange', type: '(values: string[]) => void', description: 'Fires with the full selection.' },
        { name: 'label', type: 'string', description: 'Visible field label; also names the trigger.' },
        { name: 'triggerLabel', type: 'string', defaultValue: "'Add'", description: 'Trigger text when nothing is selected.' },
        { name: 'searchPlaceholder', type: 'string', defaultValue: "'Search options'", description: 'Search placeholder and accessible name.' },
        { name: 'emptyText', type: 'string', defaultValue: "'No options'", description: 'Shown when no option matches.' },
        { name: 'maxDisplay', type: 'number', defaultValue: '3', description: 'Maximum chips before a +N more summary.' },
        { name: 'disabled', type: 'boolean', description: 'Disable the trigger and chip removal.' },
      ]}
      accessibility={[
        'The trigger is named by the visible label and exposes aria-haspopup/aria-expanded.',
        'Options are native checkboxes with wrapping labels; each chip has a named remove button.',
      ]}
    >
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
    </ComponentPage>
  );
}
