import { DemoCard } from '@/components/demo-card';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger, Button, Input } from '@slipstream-ui/core';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Usage"
        preview={
          <div className="space-y-4">
            <Popover>
          <PopoverTrigger>Details</PopoverTrigger>
          <PopoverContent>
            <p className="text-sm text-muted-foreground">More information here.</p>
            <Button size="sm" className="mt-2">Action</Button>
          </PopoverContent>
        </Popover>
          </div>
        }
        code={"import { Popover, PopoverContent, PopoverTrigger, Button, Input } from '@slipstream-ui/core';\n\nexport default function Example() {\n  return (\n    <>\n      <Popover>\n          <PopoverTrigger>Details</PopoverTrigger>\n          <PopoverContent>\n            <p className=\"text-sm text-muted-foreground\">More information here.</p>\n            <Button size=\"sm\" className=\"mt-2\">Action</Button>\n          </PopoverContent>\n        </Popover>\n    </>\n  );\n}"}
        usage={"import { Popover, PopoverContent, PopoverTrigger } from '@slipstream-ui/core';\n\n// Popover is a compound component: trigger + content\n<Popover>\n  <PopoverTrigger>Details</PopoverTrigger>\n  <PopoverContent>More information here.</PopoverContent>\n</Popover>"}
        types={"type PopoverProps = {\n  open?: boolean;\n  onOpenChange?: (open: boolean) => void;\n  className?: string;\n  children: React.ReactNode;\n};"}
      />

      <DemoCard
        title="Forms and wide content"
        preview={
          <div className="flex w-full flex-wrap items-start gap-6">
            <Popover>
              <PopoverTrigger>Invite people</PopoverTrigger>
              <PopoverContent className="w-80">
                <p className="mb-2 text-sm font-medium">Invite to workspace</p>
                <Input
                  className="mb-3"
                  type="email"
                  placeholder="teammate@company.com"
                  aria-label="Email address"
                />
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost">Cancel</Button>
                  <Button size="sm">Send invite</Button>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger>Keyboard shortcuts</PopoverTrigger>
              <PopoverContent className="w-96">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-6">
                    <span>Open command palette</span>
                    <kbd className="rounded border border-border bg-muted px-1.5 font-mono text-xs">⌘K</kbd>
                  </div>
                  <div className="flex items-center justify-between gap-6">
                    <span>Toggle dark mode</span>
                    <kbd className="rounded border border-border bg-muted px-1.5 font-mono text-xs">⌘⇧L</kbd>
                  </div>
                  <div className="flex items-center justify-between gap-6">
                    <span>Close overlay</span>
                    <kbd className="rounded border border-border bg-muted px-1.5 font-mono text-xs">Esc</kbd>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        }
        code={`import { Popover, PopoverContent, PopoverTrigger, Button, Input } from '@slipstream-ui/core';

{/* Interactive form inside the panel */}
<Popover>
  <PopoverTrigger>Invite people</PopoverTrigger>
  <PopoverContent className="w-80">
    <Input className="mb-3" type="email" placeholder="teammate@company.com" aria-label="Email address" />
    <div className="mt-3 flex justify-end gap-2">
      <Button size="sm" variant="ghost">Cancel</Button>
      <Button size="sm">Send invite</Button>
    </div>
  </PopoverContent>
</Popover>

{/* Width is a className: content flows inside */}
<PopoverContent className="w-96">…</PopoverContent>`}
        types={"type PopoverProps = {\n  open?: boolean;\n  onOpenChange?: (open: boolean) => void;\n};"}
      />

      <DemoCard
        title="Placement"
        preview={
          <div className="flex flex-wrap items-center gap-6">
            <Popover>
              <PopoverTrigger>Opens above</PopoverTrigger>
              <PopoverContent side="top" align="start">
                <p className="text-sm text-muted-foreground">
                  Prefers the top edge and flips below when there is no room.
                </p>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger>Opens right</PopoverTrigger>
              <PopoverContent side="right" align="center" sideOffset={12} collisionPadding={8}>
                <p className="text-sm text-muted-foreground">
                  sideOffset keeps the panel 12px clear of the trigger.
                </p>
              </PopoverContent>
            </Popover>
          </div>
        }
        code={`{/* Placement is a prop, not a measurement */}
<Popover>
  <PopoverTrigger>Filters</PopoverTrigger>
  <PopoverContent side="right" align="center" sideOffset={12} collisionPadding={8}>
    <FilterPanel />
  </PopoverContent>
</Popover>

{/* Near the bottom of a form the panel flips up instead of clipping */}
<PopoverContent side="top" align="start">…</PopoverContent>`}
        types={`type PopoverContentProps = React.HTMLAttributes<HTMLDivElement> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number;
  matchTriggerWidth?: boolean;
};`}
      />

      <DemoCard
        title="Anchored to a field"
        preview={
          <div className="w-full max-w-sm">
            <Popover>
              <div className="flex items-end gap-2">
                <PopoverAnchor className="flex-1">
                  <Input placeholder="2026-11-13" aria-label="Chosen date" />
                </PopoverAnchor>
                <PopoverTrigger>Pick</PopoverTrigger>
              </div>
              <PopoverContent side="bottom" align="start" matchTriggerWidth>
                <p className="text-sm text-muted-foreground">
                  The panel is anchored to the field and matches its width.
                </p>
              </PopoverContent>
            </Popover>
          </div>
        }
        code={`{/* PopoverAnchor measures the field, not the trigger */}
<Popover>
  <PopoverAnchor>
    <Input placeholder="Pick a date" />
  </PopoverAnchor>
  <PopoverTrigger>Pick</PopoverTrigger>
  <PopoverContent matchTriggerWidth>
    <Calendar value={date} onValueChange={setDate} />
  </PopoverContent>
</Popover>`}
      />
    </>
  );
}
