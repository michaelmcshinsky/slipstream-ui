'use client';

import { useState } from 'react';
import { Input } from '@slipstream-ui/core';
import { CodeBlock } from '@/components/code-block';
import { PropsTable } from '@/components/props-table';

export default function InputPage() {
  const [type, setType] = useState<'text' | 'email' | 'password' | 'number'>('text');
  const [disabled, setDisabled] = useState(false);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">Input</h1>
      <p className="text-lg text-muted-foreground mb-8">
        A text input field with support for various input types and standard HTML input attributes.
      </p>

      {/* Live Preview */}
      <div className="mb-8 p-6 border rounded-lg bg-card">
        <h2 className="text-sm font-semibold mb-4">Live Preview</h2>
        <div className="space-y-4 max-w-md">
          <Input 
            type={type} 
            placeholder={type === 'email' ? 'user@example.com' : type === 'password' ? '••••••••' : 'Enter text...'}
            disabled={disabled}
          />
        </div>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full p-2 border rounded bg-background"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
              <option value="number">Number</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="disabled"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="disabled" className="text-sm">Disabled</label>
          </div>
        </div>
      </div>

      {/* Installation */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
          <code>npx slipstream-ui add input</code>
        </pre>
        <p className="text-sm text-muted-foreground mt-2">Or import manually:</p>
        <CodeBlock className="mt-2">{`import { Input } from '@slipstream-ui/core'`}</CodeBlock>
      </div>

      {/* Usage */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Usage</h2>
        <CodeBlock>{`<Input placeholder="Enter your name" />
<Input type="email" placeholder="user@example.com" />
<Input type="password" placeholder="Enter password" />
<Input disabled placeholder="Disabled input" />`}</CodeBlock>
      </div>

      {/* Props */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Props</h2>
        <PropsTable
          rows={[
            { name: 'type', type: 'string', defaultValue: "'text'", description: 'HTML input type' },
            { name: 'placeholder', type: 'string', defaultValue: 'undefined', description: 'Placeholder text' },
            { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the input' },
            { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Marks input as required' },
          ]}
        />
      </div>

      {/* Examples */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Examples</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Text input</h3>
            <Input placeholder="Enter your name" />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Email input</h3>
            <Input type="email" placeholder="user@example.com" />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Password input</h3>
            <Input type="password" placeholder="Enter password" />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Disabled input</h3>
            <Input disabled placeholder="Disabled input" />
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Full keyboard navigation support</li>
          <li>Screen reader announces input type and placeholder</li>
          <li>Disabled state is properly announced</li>
          <li>Visible focus indicator for keyboard users</li>
          <li>Supports HTML5 validation attributes</li>
        </ul>
      </div>
    </div>
  );
}
