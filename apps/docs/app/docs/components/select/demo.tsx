'use client';

import { useState } from 'react';
import { Select } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

const sizes = [
  { value: 'default', label: 'Default' },
  { value: 'sm', label: 'Small' },
  { value: 'lg', label: 'Large' },
  { value: 'icon', label: 'Icon', disabled: true },
];

export default function Demo() {
  const [size, setSize] = useState('default');
  return (
    <>
      <DemoCard
        title="Playground"
        preview={
          <div className="w-full max-w-xs">
            <Select label="Size" value={size} onValueChange={(next) => setSize(next as string)} options={sizes} />
            <p className="mt-2 text-sm text-muted-foreground">Selected: {size}</p>
          </div>
        }
        code={`const [size, setSize] = useState('default');

<Select
  label="Size"
  value={size}
  onValueChange={setSize}
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

{/* Native multi-select: value/onChange are string[] */}
<Select
  label="Alert channels"
  multiple
  size={4}
  value={channels}
  onValueChange={setChannels}
  options={[{ value: 'email', label: 'Email' }]}
/>

{/* Or compose <option>/<optgroup> children for dynamic lists */}
<Select label="Timezone">
  <optgroup label="Americas">
    <option value="ny">New York</option>
    <option value="sf">San Francisco</option>
  </optgroup>
</Select>`}
        usage={`// multiple switches the contract to string[]; size controls how many
// native rows show. Every platform affordance (mobile picker, keyboard)
// still comes from <select>.`}
        types={`type SelectProps = {
  options?: SelectOption[];
  groups?: { label: string; options: SelectOption[] }[];
  label?: string;
  labelHidden?: boolean;
  placeholder?: string;
  multiple?: boolean;
  size?: number;
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onValueChange?: (value: string | string[]) => void;
  children?: React.ReactNode;
};`}
      />
    </>
  );
}
