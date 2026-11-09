'use client';

import { useState } from 'react';
import { SelectMenu } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
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

export default function SelectMenuPage() {
  const [plan, setPlan] = useState('pro');
  const [channels, setChannels] = useState<string[]>(['email']);

  return (
    <ComponentPage
      id="select-menu"
      title="SelectMenu"
      description="Custom listbox select for rich options: descriptions, icons, groups, multi-select, custom rows and hidden inputs for forms."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'items', type: 'SelectMenuItem[]', defaultValue: 'required', description: 'Options: { value, label, description?, icon?, disabled?, group? }.' },
        { name: 'value / defaultValue', type: 'string | string[]', description: 'Controlled or initial selection; string[] when multiple.' },
        { name: 'onValueChange', type: '(value: string | string[]) => void', description: 'Fired with the new selection.' },
        { name: 'multiple', type: 'boolean', defaultValue: 'false', description: 'Allow several selections; the listbox stays open.' },
        { name: 'placeholder', type: 'string', defaultValue: "'Select…'", description: 'Shown when nothing is selected.' },
        { name: 'name', type: 'string', description: 'Renders hidden inputs so the selection submits with a form.' },
        { name: 'renderValue / renderItem', type: 'function', description: 'Custom trigger content and option rows.' },
      ]}
      accessibility={[
        'Select-only combobox + listbox pattern: aria-haspopup, aria-expanded, aria-activedescendant, aria-selected.',
        'Arrows move, Home/End jump, Enter/Space select, Escape closes; first-letter typeahead.',
        'Disabled options expose aria-disabled and are skipped by keyboard movement.',
      ]}
    >
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
  onValueChange={setPlan}
  items={[
    { value: 'free', label: 'Free', description: '1 project', group: 'Individual' },
    { value: 'team', label: 'Team', description: 'SSO + audit log', group: 'Business' },
  ]}
/>`}
        usage={`// Unlike Select (native <select>), option content is not limited to text.
// Prefer Select when plain labels are enough — it gets the platform picker.`}
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
  items={channels}
  value={selected}
  onValueChange={setSelected}
/>`}
        usage={`// name renders one hidden input per selected value, so the selection
// submits with a plain form and works with server actions.`}
      />
    </ComponentPage>
  );
}
