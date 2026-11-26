'use client';

import { useState } from 'react';
import { DemoCard } from '@/components/demo-card';
import { FormField, Search, type SearchOption } from '@slipstream-ui/core';

const PEOPLE: SearchOption[] = [
  { value: 'user', label: 'Jane Doe', description: 'Design systems', keywords: 'user design ui' },
  { value: 'alan', label: 'Alan Turing', description: 'Platform', keywords: 'alan platform infra' },
  { value: 'grace', label: 'Grace Hopper', description: 'Developer tooling', keywords: 'grace tools compilers' },
  { value: 'katherine', label: 'Katherine Johnson', description: 'Analytics', keywords: 'katherine data math' },
  { value: 'margaret', label: 'Margaret Hamilton', description: 'Reliability', keywords: 'margaret flight software' },
];

export default function Demo() {
  const [assignee, setAssignee] = useState<string>('');

  return (
    <>
      <DemoCard
        title="Interactive"
        preview={
          <div className="w-full max-w-sm space-y-4">
            <FormField id="search-assignee" label="Assign to" hint="Type to filter: arrows + Enter work too">
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
  { value: 'user', label: 'Jane Doe', description: 'Design systems', keywords: 'user design ui' },
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
  value?: string | null;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  listLabel?: string;
  disabled?: boolean;
};`}
      />
      <DemoCard
        title="Controlled value"
        preview={
          <div className="w-full max-w-sm space-y-3">
            <Search
              aria-label="Owner"
              options={PEOPLE}
              value={assignee || null}
              onValueChange={setAssignee}
              placeholder="Search people…"
            />
            <div className="flex gap-3">
              <button
                type="button"
                className="text-xs text-primary underline-offset-4 hover:underline"
                onClick={() => setAssignee('user')}
              >
                Set Jane
              </button>
              <button
                type="button"
                className="text-xs text-primary underline-offset-4 hover:underline"
                onClick={() => setAssignee('')}
              >
                Clear
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Controlled value:{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono">{assignee || 'null'}</code>
            </p>
          </div>
        }
        code={`const [owner, setOwner] = useState<string | null>(null);

<Search
  aria-label="Owner"
  options={people}
  value={owner}               // null clears the selection
  onValueChange={setOwner}
/>`}
        usage={`// value + onValueChange make Search fully controlled: the parent owns
// the selection, so external controls (a Clear button, a filter reset) can
// drive it. Pass null to show the placeholder.`}
      />
    </>
  );
}
