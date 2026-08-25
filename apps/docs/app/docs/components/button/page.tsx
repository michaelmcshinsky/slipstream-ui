'use client';

import { useState } from 'react';
import { Button } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function ButtonPage() {
  const [variant, setVariant] = useState<'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'>('default');
  const [size, setSize] = useState<'default' | 'sm' | 'lg' | 'icon'>('default');

  return (
    <ComponentPage
      id="button"
      title="Button"
      description="A clickable button component with variants for different visual styles and sizes."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'variant', type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'", defaultValue: "'default'", description: 'Visual style variant' },
        { name: 'size', type: "'default' | 'sm' | 'lg' | 'icon'", defaultValue: "'default'", description: 'Size variant' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the button' },
      ]}
      accessibility={[
        'Full keyboard navigation with Enter and Space keys',
        'Screen reader support with proper ARIA attributes',
        'Disabled state is properly announced',
        'Visible focus indicator for keyboard users',
      ]}
    >
      <DemoCard
        title="Playground"
        preview={
          <div className="w-full max-w-sm space-y-4">
            <div className="flex gap-4 items-center">
              <Button variant={variant} size={size}>
                {size === 'icon' ? '→' : 'Click me'}
              </Button>
            </div>
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
        }
        code={`import { Button } from '@slipstream-ui/core'

<Button>Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>`}
      />
      <DemoCard
        title="Variants"
        preview={
          <div className="flex flex-wrap items-center gap-4">
            <Button>Primary</Button>
            <Button variant="destructive">Delete</Button>
            <Button variant="outline">Cancel</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">→</Button>
          </div>
        }
        code={`<Button>Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">→</Button>`}
      />
    </ComponentPage>
  );
}
