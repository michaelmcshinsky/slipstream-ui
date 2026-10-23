import { Badge } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function BadgePage() {
  return (
    <ComponentPage
      id="badge"
      title="Badge"
      description="A small status indicator component for displaying tags, counts, or status information."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'variant', type: "'default' | 'secondary' | 'destructive' | 'outline'", defaultValue: "'default'", description: 'Visual style variant' },
        { name: 'children', type: 'ReactNode', defaultValue: 'required', description: 'Content to display' },
      ]}
      accessibility={[
        'Badge content is announced by screen readers',
        'All variants meet WCAG AA contrast requirements',
        'Consider adding aria-label for status-only badges',
        'Use semantic status terminology',
      ]}
    >
      <DemoCard
        title="Variants"
        preview={
          <div className="flex flex-wrap gap-4">
            <Badge>New</Badge>
            <Badge variant="secondary">Info</Badge>
            <Badge variant="destructive">Error</Badge>
            <Badge variant="outline">Beta</Badge>
            <Badge>3</Badge>
            <Badge variant="outline">Active</Badge>
          </div>
        }
        code={`import { Badge } from '@slipstream-ui/core'

<Badge>New</Badge>
<Badge variant="secondary">Info</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Beta</Badge>
<Badge>3</Badge>`}
      />
      <DemoCard
        title="Status & count badges"
        preview={
          <div className="space-y-4">
            <div className="flex gap-2">
              <Badge>New</Badge>
              <Badge variant="outline">Beta</Badge>
              <Badge variant="outline">Active</Badge>
            </div>
            <div className="flex gap-2">
              <Badge>3</Badge>
              <Badge variant="secondary">12</Badge>
              <Badge variant="destructive">99+</Badge>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm">Messages</span>
              <Badge>3</Badge>
            </div>
          </div>
        }
        code={`<Badge>New</Badge>
<Badge variant="secondary">12</Badge>
<Badge variant="destructive">99+</Badge>

<div className="flex gap-2 items-center">
  <span>Messages</span>
  <Badge>3</Badge>
</div>`}
      />
    </ComponentPage>
  );
}
