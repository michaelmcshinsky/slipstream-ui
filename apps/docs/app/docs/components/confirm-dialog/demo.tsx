'use client';

import { useState } from 'react';
import { Button, ConfirmDialog } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function ConfirmDialogPage() {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

  return (
    <ComponentPage
      id="confirm-dialog"
      title="ConfirmDialog"
      description="Accessible confirmation dialog with async pending state, destructive variant and cancellable actions, built on Dialog."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'open / onOpenChange', type: 'boolean, (open) => void', defaultValue: 'required', description: 'Controlled visibility.' },
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Dialog title (accessible name).' },
        { name: 'description', type: 'string', description: 'Supporting line under the title.' },
        { name: 'onConfirm', type: '() => void | Promise<void>', defaultValue: 'required', description: 'Confirm handler; a promise shows a pending state.' },
        { name: 'confirmLabel / cancelLabel', type: 'string', defaultValue: "'Confirm' / 'Cancel'", description: 'Button labels.' },
        { name: 'destructive', type: 'boolean', defaultValue: 'false', description: 'Red confirm button for destructive actions.' },
      ]}
      accessibility={['Inherits Dialog: focus trap, Escape, backdrop dismissal and focus restoration.', 'Confirm shows aria-busy while a promise runs; dismissal is blocked.']}
    >
      <DemoCard
        title="Destructive and async confirmations (interactive)"
        preview={
          <div className="flex flex-wrap gap-3">
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>Delete project</Button>
            <Button onClick={() => setPublishOpen(true)}>Publish release</Button>
            <ConfirmDialog
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              title="Delete project?"
              description="This permanently removes the project and cannot be undone."
              destructive
              confirmLabel="Delete"
              onConfirm={() => new Promise((resolve) => setTimeout(resolve, 600))}
            />
            <ConfirmDialog
              open={publishOpen}
              onOpenChange={setPublishOpen}
              title="Publish release?"
              description="The current version will be published to npm with provenance."
              confirmLabel="Publish"
              onConfirm={() => new Promise((resolve) => setTimeout(resolve, 900))}
            />
          </div>
        }
        code={`<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  title="Delete project?"
  description="This permanently removes the project and cannot be undone."
  destructive
  confirmLabel="Delete"
  onConfirm={deleteProject} // async shows a pending state
/>`}
        usage={`// Return a promise from onConfirm for the pending spinner; closes on resolve.
// closeOnConfirm={false} keeps the dialog open.`}
        types={`type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
  closeOnConfirm?: boolean;
};`}
      />
    </ComponentPage>
  );
}
