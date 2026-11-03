'use client';

import { useState } from 'react';
import { Button, Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function DialogPage() {
  const [open, setOpen] = useState(false);
  const [openNoClose, setOpenNoClose] = useState(false);
  const [openWide, setOpenWide] = useState(false);
  const [openComposed, setOpenComposed] = useState(false);
  return (
    <ComponentPage
      id="dialog"
      title="Dialog"
      description="Accessible modal dialog with focus trapping, escape-to-close and focus restoration."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'open', type: 'boolean', defaultValue: 'required', description: 'Whether the dialog is visible (controlled)' },
        { name: 'onOpenChange', type: '(open: boolean) => void', defaultValue: 'required', description: 'Open/close requests' },
        { name: 'title', type: 'string', description: 'Accessible name + default header title (optional with a composed header)' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | '2xl'", defaultValue: "'md'", description: 'Panel max-width preset' },
        { name: 'header', type: 'ReactNode', description: 'Replaces the default header — compose DialogHeader/DialogTitle/DialogDescription' },
        { name: 'footer', type: 'ReactNode', description: 'Action row under the body' },
        { name: 'scrollable', type: 'boolean', defaultValue: 'false', description: 'Cap the body height and scroll inside the panel' },
        { name: 'description', type: 'string', defaultValue: '-', description: 'Optional supporting text' },
        { name: 'closeOnBackdrop', type: 'boolean', defaultValue: 'true', description: 'Backdrop click closes the dialog' },
        { name: 'showClose', type: 'boolean', defaultValue: 'true', description: 'Hide the ✕ button in the header (Escape and backdrop still close)' },
        { name: 'initialFocusRef', type: 'RefObject<HTMLElement>', defaultValue: 'first focusable', description: 'Element focused on open' },
        { name: 'animate', type: 'boolean', defaultValue: 'false', description: 'Fade the backdrop and panel in/out (needs tailwindcss-animate)' },
      ]}
      accessibility={[
        'role=dialog with aria-modal, labelled by title and described by description',
        'Initial focus moves into the dialog and returns to the opener on close',
        'Tab and Shift+Tab wrap inside the dialog',
        'Escape closes the dialog',
      ]}
    >
      <DemoCard
        title="Playground"
        preview={
          <>
            <Button onClick={() => setOpen(true)}>Delete project…</Button>
            <Dialog
              open={open}
              onOpenChange={setOpen}
              title="Delete project?"
              description="This permanently removes the project and cannot be undone."
            >
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={() => setOpen(false)}>Delete</Button>
              </div>
            </Dialog>
          </>
        }
        code={`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Delete project.</Button>

<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Delete project?"
  description="This permanently removes the project and cannot be undone."
>
  <button onClick={() => setOpen(false)}>Cancel</button>
</Dialog>`}
      />

      <DemoCard
        title="Without header close button"
        preview={
          <>
            <Button variant="outline" onClick={() => setOpenNoClose(true)}>
              Open dialog with no ✕
            </Button>
            <Dialog
              open={openNoClose}
              onOpenChange={setOpenNoClose}
              title="Confirm in the body"
              description="showClose hides the header ✕ — dismissal is via Escape, backdrop, or an explicit button below."
              showClose={false}
            >
              <div className="flex justify-end gap-2">
                <Button onClick={() => setOpenNoClose(false)}>Got it</Button>
              </div>
            </Dialog>
          </>
        }
        code={`// Remove the header ✕ while Escape/backdrop/actions still close
<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Confirm in the body"
  showClose={false}
>
  <Button onClick={() => setOpen(false)}>Got it</Button>
</Dialog>`}
        usage={`import { Dialog } from '@slipstream-ui/core';

// Forced action dialog: no header escape hatch, body owns dismissal
<Dialog open={open} onOpenChange={setOpen} title="Finish setup" showClose={false}>
  …
</Dialog>`}
        types={`type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  closeOnBackdrop?: boolean;
  showClose?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
};`}
      />
      <DemoCard
        title="Sizes and composed slots"
        preview={
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setOpenWide(true)}>Open 2xl dialog</Button>
            <Button variant="outline" onClick={() => setOpenComposed(true)}>Composed header + footer</Button>

            <Dialog
              open={openWide}
              onOpenChange={setOpenWide}
              title="Release notes"
              description="size 2xl widens the panel for dense content."
              size="2xl"
              footer={
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpenWide(false)}>Close</Button>
                  <Button onClick={() => setOpenWide(false)}>Publish</Button>
                </DialogFooter>
              }
            >
              <p className="text-sm text-muted-foreground">
                Wide body. Combine with scrollable when the content outgrows the viewport.
              </p>
            </Dialog>

            <Dialog
              open={openComposed}
              onOpenChange={setOpenComposed}
              header={
                <DialogHeader>
                  <div>
                    <DialogTitle>Invite teammates</DialogTitle>
                    <DialogDescription>They get access to this workspace.</DialogDescription>
                  </div>
                </DialogHeader>
              }
              footer={
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpenComposed(false)}>Cancel</Button>
                  <Button onClick={() => setOpenComposed(false)}>Send invites</Button>
                </DialogFooter>
              }
            >
              <p className="text-sm text-muted-foreground">Body content here.</p>
            </Dialog>
          </div>
        }
        code={`<Dialog open={open} onOpenChange={setOpen} size="2xl" footer={<DialogFooter>…</DialogFooter>}>
  …
</Dialog>

{/* Fully composed header — DialogTitle/Description pick up the aria ids */}
<Dialog
  open={open}
  onOpenChange={setOpen}
  header={
    <DialogHeader>
      <div>
        <DialogTitle>Invite teammates</DialogTitle>
        <DialogDescription>They get access to this workspace.</DialogDescription>
      </div>
    </DialogHeader>
  }
  footer={<DialogFooter>…</DialogFooter>}
>
  …
</Dialog>`}
        usage={`import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@slipstream-ui/core';

// Sizes: sm | md | lg | xl | 2xl (max-width presets)
// footer = action row · scrollable = body scrolls inside the panel
// header replaces the default row; DialogTitle/Description auto-wire
// aria-labelledby / aria-describedby`}
        types={`type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  header?: React.ReactNode;
  footer?: React.ReactNode;
  scrollable?: boolean;
  closeOnBackdrop?: boolean;
  showClose?: boolean;
};`}
      />
    </ComponentPage>
  );
}
