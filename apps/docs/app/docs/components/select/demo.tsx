'use client';

import { useState } from 'react';
import { Select } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

const sizes = [
  { value: 'default', label: 'Default' },
  { value: 'sm', label: 'Small' },
  { value: 'lg', label: 'Large' },
  { value: 'icon', label: 'Icon', disabled: true },
];

export default function SelectPage() {
  const [size, setSize] = useState('default');
  return (
    <ComponentPage
      id="select"
      title="Select"
      description="Accessible select primitive built on the native select element with controlled and uncontrolled modes."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'options', type: 'SelectOption[]', defaultValue: 'required', description: '{ value, label, disabled? } entries' },
        { name: 'label', type: 'string', defaultValue: '—', description: 'Visible, associated label' },
        { name: 'value', type: 'string', defaultValue: '—', description: 'Controlled selected value' },
        { name: 'defaultValue', type: 'string', defaultValue: '—', description: 'Uncontrolled initial value' },
        { name: 'onChange', type: '(value: string) => void', defaultValue: '—', description: 'Selection change handler' },
      ]}
      accessibility={[
        'Built on the native select: full keyboard, screen-reader and mobile support',
        'Visible labels are associated via htmlFor/id; aria-label is forwarded otherwise',
      ]}
    >
      <DemoCard
        title="Playground"
        preview={
          <div className="w-full max-w-xs">
            <Select label="Size" value={size} onChange={(next) => setSize(next as string)} options={sizes} />
            <p className="mt-2 text-sm text-muted-foreground">Selected: {size}</p>
          </div>
        }
        code={`const [size, setSize] = useState('default');

<Select
  label="Size"
  value={size}
  onChange={setSize}
  options={[
    { value: 'default', label: 'Default' },
    { value: 'sm', label: 'Small' },
    { value: 'lg', label: 'Large' },
  ]}
/>`}
      />
      <DemoCard
        title="Groups, placeholder and multi-select"
        preview={
          <div className="grid w-full max-w-xl gap-5 sm:grid-cols-2">
            <Select
              label="Plan"
              placeholder="Choose a plan"
              defaultValue=""
              groups={[
                { label: 'Individual', options: [{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }] },
                { label: 'Business', options: [{ value: 'team', label: 'Team' }, { value: 'enterprise', label: 'Enterprise' }] },
              ]}
            />
            <Select
              label="Alert channels"
              multiple
              size={4}
              defaultValue={['email']}
              options={[
                { value: 'email', label: 'Email' },
                { value: 'slack', label: 'Slack' },
                { value: 'pager', label: 'PagerDuty' },
                { value: 'webhook', label: 'Webhook' },
              ]}
            />
          </div>
        }
        code={`{/* Optgroups + placeholder (choose-one) affordance */}
<Select
  label="Plan"
  placeholder="Choose a plan"
  groups={[
    { label: 'Individual', options: [{ value: 'free', label: 'Free' }] },
    { label: 'Business', options: [{ value: 'team', label: 'Team' }] },
  ]}
/>

{/* Native multi-select — value/onChange are string[] */}
<Select
  label="Alert channels"
  multiple
  size={4}
  value={channels}
  onChange={setChannels}
  options={[{ value: 'email', label: 'Email' }]}
/>`}
        usage={`// multiple switches the contract to string[]; size controls how many
// native rows show. Every platform affordance (mobile picker, keyboard)
// still comes from <select>.`}
        types={`type SelectProps = {
  options?: SelectOption[];
  groups?: { label: string; options: SelectOption[] }[];
  label?: string;
  placeholder?: string;
  multiple?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
};`}
      />
    </ComponentPage>
  );
}
