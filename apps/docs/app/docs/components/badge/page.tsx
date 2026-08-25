'use client';

import { Badge } from '@slipstream-ui/core';

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
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mt-2">
          <code>{`import { Badge } from '@slipstream-ui/core'`}</code>
        </pre>
      </div>

      {/* Usage */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
          <code>{`<Badge>New</Badge>
<Badge variant="secondary">Info</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Beta</Badge>
<Badge>3</Badge>`}</code>
        </pre>
      </div>

      {/* Props */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Props</h2>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3">Prop</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Default</th>
                <th className="text-left p-3">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">variant</td>
                <td className="p-3 text-xs">'default' | 'secondary' | 'destructive' | 'outline'</td>
                <td className="p-3 text-xs">'default'</td>
                <td className="p-3 text-xs">Visual style variant</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">children</td>
                <td className="p-3 text-xs">ReactNode</td>
                <td className="p-3 text-xs">required</td>
                <td className="p-3 text-xs">Content to display</td>
              </tr>
            </tbody>
          </table>
        </div>
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
