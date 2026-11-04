'use client';

import { useState } from 'react';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { FormField, Search, type SearchOption } from '@slipstream-ui/core';

const PEOPLE: SearchOption[] = [
  { value: 'ada', label: 'Ada Lovelace', description: 'Design systems', keywords: 'ada design ui' },
  { value: 'alan', label: 'Alan Turing', description: 'Platform', keywords: 'alan platform infra' },
  { value: 'grace', label: 'Grace Hopper', description: 'Developer tooling', keywords: 'grace tools compilers' },
  { value: 'katherine', label: 'Katherine Johnson', description: 'Analytics', keywords: 'katherine data math' },
  { value: 'margaret', label: 'Margaret Hamilton', description: 'Reliability', keywords: 'margaret flight software' },
];

export default function SearchPage() {
  const [assignee, setAssignee] = useState<string>('');

  return (
    <ComponentPage
      id="search"
      title="Search"
      description="Select-with-search: type to filter a full-width dropdown of options, or arrow through the full set from an empty query."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'options', type: 'SearchOption[]', defaultValue: 'required', description: 'The full option set; filtered client-side as the user types.' },
        { name: 'defaultValue', type: 'string', description: 'Initially selected option value (display starts on its label).' },
        { name: 'onValueChange', type: '(value: string) => void', description: "Called with the selected option's value." },
        { name: 'placeholder', type: 'string', defaultValue: "'Search…'", description: 'Input placeholder while no query is typed.' },
        { name: 'emptyText', type: 'string', defaultValue: "'No matching results'", description: 'Shown when no option matches the query.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the input and the dropdown.' },
      ]}
      accessibility={[
        'Combobox pattern: aria-expanded/aria-controls/aria-activedescendant on the input.',
        'Keyboard: ArrowDown opens and moves, Home/End jump, Enter selects, Escape closes.',
        'Option clicks keep focus in the input — typing continues immediately.',
        'The listbox portals with fixed positioning, so scrollable parents never clip it.',
      ]}
      browserNotes={[
        'Fixed-position portalled listbox requires JavaScript; supported in every tested browser.',
      ]}
    >
      <DemoCard
        title="Interactive"
        preview={
          <div className="w-full max-w-sm space-y-4">
            <FormField id="search-assignee" label="Assign to" hint="Type to filter — arrows + Enter work too">
              <Search options={PEOPLE} aria-label="Assignee" onValueChange={setAssignee} placeholder="Search people…" />
            </FormField>
            <p className="text-xs text-muted-foreground">
              Selected value:{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono">{assignee || 'none yet'}</code>
            </p>
          </div>
        }
        code={`import { FormField, Search, type SearchOption } from '@slipstream-ui/core';

const options: SearchOption[] = [
  { value: 'ada', label: 'Ada Lovelace', description: 'Design systems', keywords: 'ada design ui' },
  { value: 'alan', label: 'Alan Turing', description: 'Platform', keywords: 'alan platform' },
];

<FormField id="assignee" label="Assign to" hint="Type to filter">
  <Search options={options} onValueChange={setAssignee} placeholder="Search people…" />
</FormField>`}
        usage={`import { Search } from '@slipstream-ui/core';

// Standalone (pass aria-label) or inside FormField for a labeled field
<Search
  aria-label="Jump to component"
  options={components}
  onValueChange={(id) => router.push(\`/c/\${id}\`)}
  emptyText="No components found"
/>`}
        types={`type SearchOption = {
  value: string;
  label: string;
  description?: string;
  keywords?: string;
};

type SearchProps = {
  options: SearchOption[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
};`}
      />
    </ComponentPage>
  );
}
