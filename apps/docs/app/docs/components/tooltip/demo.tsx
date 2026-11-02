import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Badge, Button, Input, Tooltip } from '@slipstream-ui/core';

export default function TooltipPage() {
  return (
    <ComponentPage
      id="tooltip"
      title="Tooltip"
      description="Hover/focus tooltip with aria-describedby association and Escape dismissal."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'content', type: 'string', description: 'The tooltip text.' },
        { name: 'side', type: "'top' | 'bottom' | 'left' | 'right'", defaultValue: "'top'", description: 'Placement relative to the trigger.' },
        { name: 'delay', type: 'number', defaultValue: '300', description: 'Delay before showing on hover, in ms. Use 0 for instant hints.' },
        { name: 'children', type: 'ReactElement', description: 'Exactly one trigger element (button, input, icon…).' },
      ]}
      accessibility={[
        'aria-describedby is injected into the trigger so the hint is announced with focus.',
        'Escape dismisses the tooltip without moving focus.',
        'The tooltip also shows on keyboard focus — never hide essential information in hover-only UI.',
        'Tooltips are supplementary: keep the trigger itself labeled (aria-label or visible text).',
      ]}
    >
      <DemoCard
        title="Sides"
        preview={
          <div className="flex h-32 w-full items-center justify-center gap-6">
            <Tooltip content="Placed on the left" side="left">
              <Button variant="outline">Left</Button>
            </Tooltip>
            <div className="flex flex-col items-center gap-6">
              <Tooltip content="Placed on top" side="top">
                <Button variant="outline">Top</Button>
              </Tooltip>
              <Tooltip content="Placed on the bottom" side="bottom">
                <Button variant="outline">Bottom</Button>
              </Tooltip>
            </div>
            <Tooltip content="Placed on the right" side="right">
              <Button variant="outline">Right</Button>
            </Tooltip>
          </div>
        }
        code={`import { Button, Tooltip } from '@slipstream-ui/core';

<Tooltip content="Placed on top" side="top">
  <Button variant="outline">Top</Button>
</Tooltip>
<Tooltip content="Placed on the bottom" side="bottom">
  <Button variant="outline">Bottom</Button>
</Tooltip>
<Tooltip content="Placed on the left" side="left">
  <Button variant="outline">Left</Button>
</Tooltip>
<Tooltip content="Placed on the right" side="right">
  <Button variant="outline">Right</Button>
</Tooltip>`}
      />

      <DemoCard
        title="Delays & real uses"
        preview={
          <div className="flex w-full flex-wrap items-center justify-center gap-5">
            <Tooltip content="Shows after 300ms (default)">
              <Button>Default delay</Button>
            </Tooltip>
            <Tooltip content="Instant hint — no wait" delay={0}>
              <Button variant="secondary">delay={0}</Button>
            </Tooltip>
            <Tooltip content="Slower reveal for dense UIs" delay={700}>
              <Button variant="ghost">delay={700}</Button>
            </Tooltip>
            <Tooltip content="Keyboard shortcuts: ⌘K to search" side="bottom">
              <Button size="icon" aria-label="Keyboard shortcuts">⌘</Button>
            </Tooltip>
            <Tooltip content="Copy share link to clipboard" side="top">
              <Badge variant="outline" tabIndex={0}>Hover/focus me</Badge>
            </Tooltip>
            <Tooltip content="Tooltips work on form controls too" side="right">
              <Input readOnly value="Focus me with Tab" className="w-48" />
            </Tooltip>
          </div>
        }
        code={`import { Badge, Button, Input, Tooltip } from '@slipstream-ui/core';

{/* Delay tuning */}
<Tooltip content="Shows after 300ms (default)"><Button>Default</Button></Tooltip>
<Tooltip content="Instant" delay={0}><Button>delay={0}</Button></Tooltip>
<Tooltip content="Slower reveal" delay={700}><Button>delay={700}</Button></Tooltip>

{/* Icon-only triggers MUST carry an aria-label (the tooltip supplements it) */}
<Tooltip content="Keyboard shortcuts: ⌘K" side="bottom">
  <Button size="icon" aria-label="Keyboard shortcuts">⌘</Button>
</Tooltip>

{/* Works on any single element — badges, inputs, links */}
<Tooltip content="Copy share link" side="top">
  <Badge variant="outline" tabIndex={0}>Share</Badge>
</Tooltip>`}
        usage={`import { Tooltip, Button } from '@slipstream-ui/core';

// Wrapper must render exactly one element
<Tooltip content="Save your changes" side="top" delay={200}>
  <Button>Save</Button>
</Tooltip>`}
        types={`interface TooltipProps {
  content: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  children: ReactElement;
}`}
      />
    </ComponentPage>
  );
}
