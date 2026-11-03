'use client';

import { useState } from 'react';
import { Button, Checkbox, Drawer, Form, FormField, Input, Label } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function DrawerPage() {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<'left' | 'right' | 'top' | 'bottom'>('right');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [openBottom, setOpenBottom] = useState(false);

  return (
    <ComponentPage
      id="drawer"
      title="Drawer"
      description="Edge sheet for secondary flows: slides from any side (sm/md/lg), with Dialog-grade modal semantics (portal, focus trap, Escape, focus restoration)."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'open', type: 'boolean', defaultValue: 'required', description: 'Whether the drawer is visible (controlled).' },
        { name: 'onOpenChange', type: '(open: boolean) => void', defaultValue: 'required', description: 'Close requests (✕, Escape, backdrop, your own triggers).' },
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Accessible dialog name rendered as the header title.' },
        { name: 'description', type: 'string', description: 'Supporting line under the title (wired via aria-describedby).' },
        { name: 'side', type: "'left' | 'right' | 'top' | 'bottom'", defaultValue: "'right'", description: 'Edge the drawer slides from.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Extent along the side axis (width for sides, height for top/bottom).' },
        { name: 'closeOnBackdrop', type: 'boolean', defaultValue: 'true', description: 'Clicking the backdrop closes the drawer.' },
        { name: 'showClose', type: 'boolean', defaultValue: 'true', description: 'Hide the header ✕ (Escape and backdrop still close).' },
        { name: 'initialFocusRef', type: 'RefObject<HTMLElement | null>', description: 'Element focused on open (defaults to first focusable).' },
      ]}
      accessibility={[
        'role=dialog + aria-modal, labelled by title, described by description; portals to body.',
        'Focus moves in on open, Tab/Shift+Tab are trapped, focus restores to the opener on close.',
        'Escape closes; backdrop click closes when closeOnBackdrop (default).',
        'Body scrolls internally — the page behind never moves.',
      ]}
    >
      <DemoCard
        title="Playground (interactive)"
        preview={
          <div className="w-full space-y-4">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label htmlFor="dr-side" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  side
                </label>
                <select
                  id="dr-side"
                  value={side}
                  onChange={(e) => setSide(e.target.value as typeof side)}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="right">right</option>
                  <option value="left">left</option>
                  <option value="top">top</option>
                  <option value="bottom">bottom</option>
                </select>
              </div>
              <div>
                <label htmlFor="dr-size" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  size
                </label>
                <select
                  id="dr-size"
                  value={size}
                  onChange={(e) => setSize(e.target.value as typeof size)}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="sm">sm</option>
                  <option value="md">md</option>
                  <option value="lg">lg</option>
                </select>
              </div>
              <Button onClick={() => setOpen(true)}>Open filter drawer</Button>
            </div>

            <Drawer
              open={open}
              onOpenChange={setOpen}
              title="Filter results"
              description="Narrow by status — Escape or the backdrop closes."
              side={side}
              size={size}
            >
              <Form gap="sm" noValidate>
                <FormField id="dr-status" label="Status">
                  <Input placeholder="live, archived…" />
                </FormField>
                <FormField id="dr-after" label="Updated after">
                  <Input type="date" />
                </FormField>
                <div className="mt-2 flex items-center gap-2">
                  <Checkbox id="dr-failed" defaultChecked aria-label="Include failed" />
                  <Label htmlFor="dr-failed">Include failed runs</Label>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" onClick={() => setOpen(false)}>
                    Apply
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
                    Reset
                  </Button>
                </div>
              </Form>
            </Drawer>
          </div>
        }
        code={`<Button onClick={() => setOpen(true)}>Open filter drawer</Button>

<Drawer
  open={open}
  onOpenChange={setOpen}
  title="Filter results"
  description="Narrow by status"
  side="${side}"
  size="${size}"
>
  <Form gap="sm" noValidate>
    <FormField id="status" label="Status"><Input /></FormField>
    <Button size="sm" onClick={apply}>Apply</Button>
  </Form>
</Drawer>`}
        usage={`import { Drawer } from '@slipstream-ui/core';

// Side panel with form content
<Drawer open={open} onOpenChange={setOpen} title="Filters" side="right" size="md">
  …
</Drawer>

// Mobile nav from the bottom
<Drawer open={nav} onOpenChange={setNav} title="Jump to" side="bottom" size="sm">
  …
</Drawer>`}
        types={`type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg';
  closeOnBackdrop?: boolean;
  showClose?: boolean;
};`}
      />

      <DemoCard
        title="Bottom sheet"
        preview={
          <div className="flex w-full items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Common on mobile — an action sheet from the bottom edge.
            </p>
            <Button variant="outline" onClick={() => setOpenBottom(true)}>
              Open bottom sheet
            </Button>
            <Drawer
              open={openBottom}
              onOpenChange={setOpenBottom}
              title="Share conversation"
              side="bottom"
              size="sm"
              description="Pick a destination — sm keeps it compact."
            >
              <div className="flex flex-col gap-2">
                <Button variant="ghost" onClick={() => setOpenBottom(false)}>Copy link</Button>
                <Button variant="ghost" onClick={() => setOpenBottom(false)}>Export as Markdown</Button>
                <Button variant="ghost" onClick={() => setOpenBottom(false)}>Cancel</Button>
              </div>
            </Drawer>
          </div>
        }
        code={`<Drawer open={open} onOpenChange={setOpen} title="Share conversation" side="bottom" size="sm">
  <div className="flex flex-col gap-2">
    <Button variant="ghost">Copy link</Button>
    <Button variant="ghost">Export as Markdown</Button>
  </div>
</Drawer>`}
      />
    </ComponentPage>
  );
}
