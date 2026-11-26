'use client';

import { useState } from 'react';
import { Button, Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [openNoClose, setOpenNoClose] = useState(false);
  const [openWide, setOpenWide] = useState(false);
  const [openComposed, setOpenComposed] = useState(false);
  return (
    <>
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

<Button onClick={() => setOpen(true)}>Delete project…</Button>

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
              description="showClose hides the header ✕: dismissal is via Escape, backdrop, or an explicit button below."
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

{/* Fully composed header: DialogTitle/Description pick up the aria ids */}
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
    </>
  );
}
