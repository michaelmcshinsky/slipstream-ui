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
            <Select label="Size" value={size} onChange={setSize} options={sizes} />
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
    </ComponentPage>
  );
}
