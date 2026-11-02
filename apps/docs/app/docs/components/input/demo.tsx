'use client';

import { Input } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function InputPage() {
  return (
    <ComponentPage
      id="input"
      title="Input"
      description="A text input field with support for various input types and standard HTML input attributes."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'type', type: 'string', defaultValue: "'text'", description: 'HTML input type' },
        { name: 'placeholder', type: 'string', defaultValue: 'undefined', description: 'Placeholder text' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the input' },
        { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Marks input as required' },
      ]}
      accessibility={[
        'Full keyboard navigation support',
        'Screen reader announces input type and placeholder',
        'Disabled state is properly announced',
        'Visible focus indicator for keyboard users',
        'Supports HTML5 validation attributes',
      ]}
    >
      <DemoCard
        title="Types"
        preview={
          <div className="w-full max-w-md space-y-4">
            <Input placeholder="Enter your name" />
            <Input type="email" placeholder="user@example.com" />
            <Input type="password" placeholder="Enter password" />
            <Input disabled placeholder="Disabled input" />
          </div>
        }
        code={`import { Input } from '@slipstream-ui/core'

<Input placeholder="Enter your name" />
<Input type="email" placeholder="user@example.com" />
<Input type="password" placeholder="Enter password" />
<Input disabled placeholder="Disabled input" />`}
      />
    </ComponentPage>
  );
}
