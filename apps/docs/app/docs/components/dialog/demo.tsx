'use client';

import { useState } from 'react';
import { Button, Dialog } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function DialogPage() {
  const [open, setOpen] = useState(false);
  const [openNoClose, setOpenNoClose] = useState(false);
  return (
    <ComponentPage
      id="dialog"
      title="Dialog"
      description="Accessible modal dialog with focus trapping, escape-to-close and focus restoration."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'open', type: 'boolean', defaultValue: 'required', description: 'Whether the dialog is visible (controlled)' },
        { name: 'onOpenChange', type: '(open: boolean) => void', defaultValue: 'required', description: 'Open/close requests' },
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Accessible dialog name' },
        { name: 'description', type: 'string', defaultValue: '-', description: 'Optional supporting text' },
        { name: 'closeOnBackdrop', type: 'boolean', defaultValue: 'true', description: 'Backdrop click closes the dialog' },
        { name: 'showClose', type: 'boolean', defaultValue: 'true', description: 'Hide the ✕ button in the header (Escape and backdrop still close)' },
        { name: 'initialFocusRef', type: 'RefObject<HTMLElement>', defaultValue: 'first focusable', description: 'Element focused on open' },
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
    </ComponentPage>
  );
}
