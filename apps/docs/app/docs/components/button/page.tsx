'use client';

import { useState } from 'react';
import { Button } from '@slipstream-ui/core';
import { CodeBlock } from '@/components/code-block';
import { PropsTable } from '@/components/props-table';

export default function ButtonPage() {
  const [variant, setVariant] = useState<'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'>('default');
  const [size, setSize] = useState<'default' | 'sm' | 'lg' | 'icon'>('default');

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">Button</h1>
      <p className="text-lg text-muted-foreground mb-8">
        A clickable button component with variants for different visual styles and sizes.
      </p>

      {/* Live Preview */}
      <div className="mb-8 p-6 border rounded-lg bg-card">
        <h2 className="text-sm font-semibold mb-4">Live Preview</h2>
        <div className="flex gap-4 items-center mb-4">
          <Button variant={variant} size={size}>
            {size === 'icon' ? '→' : 'Click me'}
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Variant</label>
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value as any)}
              className="w-full p-2 border rounded bg-background"
            >
              <option value="default">Default</option>
              <option value="destructive">Destructive</option>
              <option value="outline">Outline</option>
              <option value="secondary">Secondary</option>
              <option value="ghost">Ghost</option>
              <option value="link">Link</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Size</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as any)}
              className="w-full p-2 border rounded bg-background"
            >
              <option value="default">Default</option>
              <option value="sm">Small</option>
              <option value="lg">Large</option>
              <option value="icon">Icon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Installation */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
          <code>npx slipstream-ui add button</code>
        </pre>
        <p className="text-sm text-muted-foreground mt-2">Or import manually:</p>
        <CodeBlock className="mt-2">{`import { Button } from '@slipstream-ui/core'`}</CodeBlock>
      </div>

      {/* Usage */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Usage</h2>
        <CodeBlock>{`<Button>Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>`}</CodeBlock>
      </div>

      {/* Props */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Props</h2>
        <PropsTable
          rows={[
            { name: 'variant', type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'", defaultValue: "'default'", description: 'Visual style variant' },
            { name: 'size', type: "'default' | 'sm' | 'lg' | 'icon'", defaultValue: "'default'", description: 'Size variant' },
            { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the button' },
          ]}
        />
      </div>

      {/* Examples */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Examples</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Primary action</h3>
            <Button>Click me</Button>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Destructive action</h3>
            <Button variant="destructive">Delete</Button>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Outline button</h3>
            <Button variant="outline">Cancel</Button>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Icon button</h3>
            <Button size="icon">→</Button>
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Full keyboard navigation with Enter and Space keys</li>
          <li>Screen reader support with proper ARIA attributes</li>
          <li>Disabled state is properly announced</li>
          <li>Visible focus indicator for keyboard users</li>
        </ul>
      </div>
    </div>
  );
}
