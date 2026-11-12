'use client';

import { useState } from 'react';
import { Button, Checkbox, Drawer, Form, FormField, Input, Label } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function DrawerPage() {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<'left' | 'right' | 'top' | 'bottom'>('right');
  const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('md');
  const [customWidth, setCustomWidth] = useState('');
  const [openBottom, setOpenBottom] = useState(false);
  const [animate, setAnimate] = useState(true);

  return (
    <ComponentPage
      id="drawer"
      title="Drawer"
      description="Edge sheet for secondary flows: slides from any side (sm/md/lg), with Dialog-grade modal semantics (portal, focus trap, Escape, focus restoration)."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'open', type: 'boolean', defaultValue: 'required', description: 'Whether the drawer is visible (controlled).' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Close requests (✕, Escape, backdrop, your own triggers).' },
        { name: 'onClose', type: '() => void', description: 'Close-request alias for onOpenChange(false); used when only a close handler is passed.' },
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Accessible dialog name rendered as the header title.' },
        { name: 'description', type: 'string', description: 'Supporting line under the title (wired via aria-describedby).' },
        { name: 'side', type: "'left' | 'right' | 'top' | 'bottom'", defaultValue: "'right'", description: 'Edge the drawer slides from.' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | '2xl'", defaultValue: "'md'", description: 'Preset extent along the side axis (width for sides, height for top/bottom).' },
        { name: 'width', type: 'number | string', description: 'Custom extent for left/right drawers — pixels (520) or any CSS length ("70vw"). Overrides size.' },
        { name: 'height', type: 'number | string', description: 'Custom extent for top/bottom drawers — pixels (320) or any CSS length ("60vh"). Overrides size.' },
        { name: 'closeOnBackdrop', type: 'boolean', defaultValue: 'true', description: 'Clicking the backdrop closes the drawer.' },
        { name: 'showClose', type: 'boolean', defaultValue: 'true', description: 'Hide the header ✕ (Escape and backdrop still close).' },
        { name: 'initialFocusRef', type: 'RefObject<HTMLElement | null>', description: 'Element focused on open (defaults to first focusable).' },
        { name: 'animate', type: 'boolean', defaultValue: 'false', description: 'Slide the panel in from its edge and out on close (needs tailwindcss-animate).' },
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
                  <option value="xl">xl</option>
                  <option value="2xl">2xl</option>
                </select>
              </div>
              <div>
                <label htmlFor="dr-width" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  width (px)
                </label>
                <input
                  id="dr-width"
                  type="number"
                  min={240}
                  step={16}
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                  placeholder="auto"
                  className="w-28 rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-center gap-2 pb-2">
                <input
                  id="dr-animate"
                  type="checkbox"
                  checked={animate}
                  onChange={(e) => setAnimate(e.target.checked)}
                  className="h-4 w-4 rounded-sm border border-primary"
                />
                <label htmlFor="dr-animate" className="text-sm text-muted-foreground">
                  animate
                </label>
              </div>
              <Button onClick={() => setOpen(true)}>Open filter drawer</Button>
            </div>

            <Drawer
              open={open}
              onOpenChange={setOpen}
              title="Filter results"
              description="Narrow by status — Escape or the backdrop closes."
              side={side}
              width={customWidth ? Number(customWidth) : undefined}
              animate={animate}
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
