'use client';

import * as React from 'react';
import { Button } from '../button/Button';
import { Dialog, DialogFooter } from '../dialog/Dialog';

export type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Confirm button label. Default 'Confirm'. */
  confirmLabel?: string;
  /** Cancel button label. Default 'Cancel'. */
  cancelLabel?: string;
  /** Destructive confirmation (red confirm button + destructive panel accent). */
  destructive?: boolean;
  /**
   * Confirm handler. Return a promise to show a pending state; the dialog
   * closes automatically when it resolves unless `closeOnConfirm` is false.
   */
  onConfirm: () => void | Promise<void>;
  closeOnConfirm?: boolean;
  /** Extra body content above the actions. */
  children?: React.ReactNode;
};

/**
 * Accessible confirmation dialog built on Dialog: focus trap, Escape,
 * backdrop dismissal and focus restoration come from the primitive, plus a
 * pending state for async confirmations (79 hand-rolled confirm modals in
 * the audited apps use this exact shape).
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  closeOnConfirm = true,
  children,
}: ConfirmDialogProps) {
  const [pending, setPending] = React.useState(false);

  const handleConfirm = async () => {
    try {
      setPending(true);
      await onConfirm();
      if (closeOnConfirm) onOpenChange(false);
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (pending) return;
        onOpenChange(next);
      }}
      title={title}
      description={description}
      size="sm"
      footer={
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={pending}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'destructive' : 'default'}
            onClick={handleConfirm}
            loading={pending}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      }
    >
      {children}
    </Dialog>
  );
}
