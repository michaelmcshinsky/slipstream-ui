'use client';

import { useState } from 'react';
import { Button, FormField, Input, InputGroup, InputGroupAddon } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default function InputGroupPage() {
  const [query, setQuery] = useState('');
  const [amount, setAmount] = useState('10');

  return (
    <ComponentPage
      id="input-group"
      title="InputGroup"
      description="Composite input shell with flush left/right addons (icons, units, buttons) behind one outer outline; the nested field sheds its own border so the group reads as a single control."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'side', type: "'left' | 'right'", defaultValue: "'left'", description: 'Edge the addon hugs (flush against the group outline).' },
        { name: 'variant', type: "'ghost' | 'muted'", defaultValue: "'ghost'", description: 'Addon surface: ghost keeps the group background, muted paints a light gray.' },
        { name: 'children', type: 'ReactNode', description: 'Nested field (Input/Textarea/Select) plus any InputGroupAddon slots.' },
      ]}
      accessibility={[
        'The group is focusable chrome only — the nested input keeps focus, its label association, and keyboard behavior.',
        'Mark decorative addons aria-hidden; include meaningful units in the field’s accessible name (aria-label="Amount in PLN").',
        'Disable addon buttons yourself when the field is disabled.',
      ]}
    >
      <DemoCard
        title="URL field with muted affixes"
        preview={
          <div className="w-full max-w-lg">
            <FormField id="ig-url" label="Site address">
              <InputGroup>
                <InputGroupAddon side="left" variant="muted">
                  https://
                </InputGroupAddon>
                <Input placeholder="example.com" defaultValue="slipstream-ui" />
                <InputGroupAddon side="right" variant="muted">
                  .com
                </InputGroupAddon>
              </InputGroup>
            </FormField>
          </div>
        }
        code={`<FormField id="url" label="Site address">
  <InputGroup>
    <InputGroupAddon side="left" variant="muted">https://</InputGroupAddon>
    <Input placeholder="example.com" defaultValue="slipstream-ui" />
    <InputGroupAddon side="right" variant="muted">.com</InputGroupAddon>
  </InputGroup>
</FormField>`}
        usage={`import { InputGroup, InputGroupAddon, Input } from '@slipstream-ui/core';

// Ghost addons keep the group background; muted paints light gray.
<InputGroup>
  <InputGroupAddon side="left" variant="muted">https://</InputGroupAddon>
  <Input />
  <InputGroupAddon side="right" variant="muted">.com</InputGroupAddon>
</InputGroup>`}
        types={`type InputGroupAddonProps = {
  side?: 'left' | 'right';
  variant?: 'ghost' | 'muted';
};`}
      />

      <DemoCard
        title="Search with icon and action (interactive)"
        preview={
          <div className="w-full max-w-lg space-y-4">
            <InputGroup>
              <InputGroupAddon side="left" aria-hidden="true">
                <SearchIcon />
              </InputGroupAddon>
              <Input
                aria-label="Search issues"
                placeholder="Search issues…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <InputGroupAddon side="right" variant="muted">
                <Button size="sm" variant="ghost" type="button">
                  Search
                </Button>
              </InputGroupAddon>
            </InputGroup>
            <p className="text-sm text-muted-foreground">
              query: <code className="text-foreground">{query || '—'}</code>
            </p>
          </div>
        }
        code={`<InputGroup>
  <InputGroupAddon side="left" aria-hidden="true"><SearchIcon /></InputGroupAddon>
  <Input aria-label="Search issues" placeholder="Search issues…" />
  <InputGroupAddon side="right" variant="muted">
    <Button size="sm" variant="ghost">Search</Button>
  </InputGroupAddon>
</InputGroup>`}
        usage={`// The outline is the affordance; the trailing button is the action.
// The icon is decorative (aria-hidden) — the input carries the name.`}
      />

      <DemoCard
        title="Numeric input with currency (interactive)"
        preview={
          <div className="w-full max-w-lg space-y-4">
            <FormField id="ig-amount" label="Amount">
              <InputGroup>
                <Input
                  aria-label="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <InputGroupAddon side="right" variant="muted">
                  PLN
                </InputGroupAddon>
              </InputGroup>
            </FormField>
            <p className="text-sm text-muted-foreground">
              total: <span className="font-medium text-foreground">{Number(amount || 0) * 12} PLN / year</span>
            </p>
          </div>
        }
        code={`<FormField id="amount" label="Amount">
  <InputGroup>
    <Input aria-label="Amount" type="number" value={amount} onChange={…} />
    <InputGroupAddon side="right" variant="muted">PLN</InputGroupAddon>
  </InputGroup>
</FormField>`}
        usage={`// Units belong in the group, not as placeholder text — the value
// stays parseable and the label stays clean.`}
      />
    </ComponentPage>
  );
}
