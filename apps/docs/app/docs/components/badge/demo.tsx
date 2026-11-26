import { Badge } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
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
    </>
  );
}
