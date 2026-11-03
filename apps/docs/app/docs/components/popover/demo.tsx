import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Popover, PopoverContent, PopoverTrigger, Button } from '@slipstream-ui/core';

export default function PopoverPage() {
  return (
    <ComponentPage
      id="popover"
      title="Popover"
      description="Floating panel anchored to a trigger with interactive content."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'open', type: 'boolean', description: 'Controlled open state.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the open state changes.' },
      ]}
      accessibility={[
        'role=dialog with aria-labelledby linking to the trigger.',
        'Escape closes the popover; outside click dismisses it.',
      ]}
    >
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
        code={"import { Popover, PopoverContent, PopoverTrigger, Button } from '@slipstream-ui/core';\n\nexport default function Example() {\n  return (\n    <>\n      <Popover>\n          <PopoverTrigger>Details</PopoverTrigger>\n          <PopoverContent>\n            <p className=\"text-sm text-muted-foreground\">More information here.</p>\n            <Button size=\"sm\" className=\"mt-2\">Action</Button>\n          </PopoverContent>\n        </Popover>\n    </>\n  );\n}"}
        usage={"import { Popover } from '@slipstream-ui/core';\n\n// Basic usage\n<Popover />"}
        types={"interface PopoverProps {\n  open: boolean;\n  onOpenChange: (open: boolean) => void;\n}"}
      />

      <DemoCard
        title="Forms and wide content"
        preview={
          <div className="flex w-full flex-wrap items-start gap-6">
            <Popover>
              <PopoverTrigger>Invite people</PopoverTrigger>
              <PopoverContent className="w-80">
                <p className="mb-2 text-sm font-medium">Invite to workspace</p>
                <input
                  className="mb-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
        code={`import { Popover, PopoverContent, PopoverTrigger, Button } from '@slipstream-ui/core';

{/* Interactive form inside the panel */}
<Popover>
  <PopoverTrigger>Invite people</PopoverTrigger>
  <PopoverContent className="w-80">
    <input className="w-full rounded-md border border-input px-3 py-2 text-sm" placeholder="teammate@company.com" />
    <div className="mt-3 flex justify-end gap-2">
      <Button size="sm" variant="ghost">Cancel</Button>
      <Button size="sm">Send invite</Button>
    </div>
  </PopoverContent>
</Popover>

{/* Width is a className — content flows inside */}
<PopoverContent className="w-96">…</PopoverContent>`}
        types={"type PopoverProps = {\n  open?: boolean;\n  onOpenChange?: (open: boolean) => void;\n};"}
      />
    </ComponentPage>
  );
}
