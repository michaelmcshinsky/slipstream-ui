'use client';

import { Badge } from '@slipstream-ui/core';
import { CodeBlock } from '@/components/code-block';
import { PropsTable } from '@/components/props-table';

export default function BadgePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">Badge</h1>
      <p className="text-lg text-muted-foreground mb-8">
        A small status indicator component for displaying tags, counts, or status information.
      </p>

      {/* Live Preview */}
      <div className="mb-8 p-6 border rounded-lg bg-card">
        <h2 className="text-sm font-semibold mb-4">Live Preview</h2>
        <div className="flex flex-wrap gap-4">
          <Badge>New</Badge>
          <Badge variant="secondary">Info</Badge>
          <Badge variant="destructive">Error</Badge>
          <Badge variant="outline">Beta</Badge>
          <Badge>3</Badge>
          <Badge variant="outline">Active</Badge>
        </div>
      </div>

      {/* Installation */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
          <code>npx slipstream-ui add badge</code>
        </pre>
        <p className="text-sm text-muted-foreground mt-2">Or import manually:</p>
        <CodeBlock className="mt-2">{`import { Badge } from '@slipstream-ui/core'`}</CodeBlock>
      </div>

      {/* Usage */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Usage</h2>
        <CodeBlock>{`<Badge>New</Badge>
<Badge variant="secondary">Info</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Beta</Badge>
<Badge>3</Badge>`}</CodeBlock>
      </div>

      {/* Props */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Props</h2>
        <PropsTable
          rows={[
            { name: 'variant', type: "'default' | 'secondary' | 'destructive' | 'outline'", defaultValue: "'default'", description: 'Visual style variant' },
            { name: 'children', type: 'ReactNode', defaultValue: 'required', description: 'Content to display' },
          ]}
        />
      </div>

      {/* Examples */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Examples</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Status badges</h3>
            <div className="flex gap-2">
              <Badge>New</Badge>
              <Badge variant="outline">Beta</Badge>
              <Badge variant="outline">Active</Badge>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Count badges</h3>
            <div className="flex gap-2">
              <Badge>3</Badge>
              <Badge variant="secondary">12</Badge>
              <Badge variant="destructive">99+</Badge>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">With buttons</h3>
            <div className="flex gap-2 items-center">
              <span className="text-sm">Messages</span>
              <Badge>3</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Badge content is announced by screen readers</li>
          <li>All variants meet WCAG AA contrast requirements</li>
          <li>Consider adding aria-label for status-only badges</li>
          <li>Use semantic status terminology</li>
        </ul>
      </div>
    </div>
  );
}
