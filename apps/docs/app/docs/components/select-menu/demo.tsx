'use client';

import { useState } from 'react';
import { SelectMenu } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

const PLANS = [
  { value: 'free', label: 'Free', description: '1 project, community support', group: 'Individual' },
  { value: 'pro', label: 'Pro', description: 'Unlimited projects, priority support', group: 'Individual' },
  { value: 'team', label: 'Team', description: 'SSO, audit log, shared billing', group: 'Business' },
  { value: 'enterprise', label: 'Enterprise', description: 'Contact sales', group: 'Business', disabled: true },
];

const CHANNELS = [
  { value: 'email', label: 'Email' },
  { value: 'slack', label: 'Slack' },
  { value: 'pager', label: 'PagerDuty' },
];

export default function Demo() {
  const [plan, setPlan] = useState('pro');
  const [channels, setChannels] = useState<string[]>(['email']);

  return (
    <>
      <DemoCard
        title="Rich single select (interactive)"
        preview={
          <div className="w-full max-w-sm">
            <SelectMenu aria-label="Plan" items={PLANS} value={plan} onValueChange={(next) => setPlan(next as string)} />
            <p className="mt-2 text-sm text-muted-foreground">
              selected: <code className="text-foreground">{plan}</code>
            </p>
          </div>
        }
        code={`const [plan, setPlan] = useState('pro');

<SelectMenu
  aria-label="Plan"
  value={plan}
  onValueChange={(next) => setPlan(next as string)}
  items={[
    { value: 'free', label: 'Free', description: '1 project', group: 'Individual' },
    { value: 'team', label: 'Team', description: 'SSO + audit log', group: 'Business' },
  ]}
/>`}
        usage={`// Unlike Select (native <select>), option content is not limited to text.
// Prefer Select when plain labels are enough: it gets the platform picker.`}
        types={`type SelectMenuItem = {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  group?: string;
};

type SelectMenuProps = {
  items: SelectMenuItem[];
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  multiple?: boolean;
  placeholder?: string;
  name?: string;
  renderValue?: (selected: SelectMenuItem[]) => React.ReactNode;
  renderItem?: (item: SelectMenuItem, state: { selected: boolean; active: boolean }) => React.ReactNode;
  emptyText?: string;
};`}
      />

      <DemoCard
        title="Multi-select with form inputs (interactive)"
        preview={
          <div className="w-full max-w-sm">
            <SelectMenu
              aria-label="Alert channels"
              multiple
              name="channels"
              items={CHANNELS}
              value={channels}
              onValueChange={(next) => setChannels(next as string[])}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              values: <code className="text-foreground">[{channels.join(', ')}]</code>
            </p>
          </div>
        }
        code={`<SelectMenu
  aria-label="Alert channels"
  multiple
  name="channels"
  items={CHANNELS}
  value={channels}
  onValueChange={(next) => setChannels(next as string[])}
/>`}
        usage={`// name renders one hidden input per selected value, so the selection
// submits with a plain form and works with server actions.`}
      />
      <DemoCard
        title="Custom rows, value and empty state"
        preview={
          <div className="w-full max-w-sm space-y-4">
            <SelectMenu
              aria-label="Deployment target"
              items={PLANS.filter((item) => item.value !== 'enterprise')}
              value={plan}
              onValueChange={(next) => setPlan(next as string)}
              renderValue={(selected) => (
                <span className="font-medium">{selected[0]?.label ?? 'Pick a plan'}</span>
              )}
              renderItem={(item, state) => (
                <span className={state.active ? 'underline' : undefined}>
                  {item.label}
                  {state.selected ? ' ✓' : ''}
                </span>
              )}
            />
            <SelectMenu
              aria-label="Empty list"
              items={[]}
              placeholder="Nothing available"
              emptyText="No plans match your filters"
            />
          </div>
        }
        code={`<SelectMenu
  aria-label="Deployment target"
  items={plans}
  value={plan}
  onValueChange={setPlan}
  renderValue={(selected) => <strong>{selected[0]?.label}</strong>}
  renderItem={(item, { selected, active }) => (
    <span className={active ? 'underline' : ''}>
      {item.label}{selected ? ' ✓' : ''}
    </span>
  )}
/>

<SelectMenu items={[]} emptyText="No plans match your filters" />`}
        usage={`// renderValue customizes the trigger content; renderItem customizes
// each option row (receives { selected, active }). Group headings come from
// item.group; first-letter typeahead jumps to matching options.`}
      />
    </>
  );
}
