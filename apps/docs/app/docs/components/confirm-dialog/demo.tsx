'use client';

import { useState } from 'react';
import { Button, ConfirmDialog } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

  return (
    <>
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
    </>
  );
}
