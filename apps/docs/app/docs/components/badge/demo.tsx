import { Badge } from '@slipstream-ui/core';
import { ComponentPage, type ComponentPageProps } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function BadgePage({ manifest }: { manifest?: ComponentPageProps['manifest'] }) {
  return (
    <ComponentPage
        manifest={manifest}
      id="badge"
      title="Badge"
      description="A small status indicator component for displaying tags, counts, or status information."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'asChild', type: 'boolean', defaultValue: 'false', description: 'Render the child (e.g. a router Link) with badge styling.' },
        { name: 'variant', type: "'default' | 'primary' | 'neutral' | 'accent' | 'danger' | 'success' | 'warning' | 'info' | 'secondary' | 'destructive' | 'outline' | 'outline-success' | 'outline-warning' | 'outline-info' | 'outline-danger'", defaultValue: "'default'", description: 'Visual style variant; primary/danger are aliases, outline-* are quiet status tones for metadata chips.' },
        { name: 'dot', type: 'boolean', defaultValue: 'false', description: 'Leading status dot colored to match the variant.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Pill scale: sm for dense tables, lg for hero and metadata strips.' },
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
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              <Badge>New</Badge>
              <Badge variant="secondary">Info</Badge>
              <Badge variant="destructive">Error</Badge>
              <Badge variant="outline">Beta</Badge>
              <Badge variant="success">Live</Badge>
              <Badge variant="warning">Draft</Badge>
              <Badge variant="info">Beta</Badge>
              <Badge variant="neutral">12</Badge>
              <Badge variant="accent">Pro</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
            </div>
          </div>
        }
        code={`import { Badge } from '@slipstream-ui/core'

<Badge>New</Badge>
<Badge variant="secondary">Info</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Beta</Badge>
<Badge variant="success">Live</Badge>
<Badge variant="warning">Draft</Badge>
<Badge variant="info">Beta</Badge>
<Badge variant="neutral">12</Badge>
<Badge variant="accent">Pro</Badge>

{/* Sizes */}
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>`}
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
