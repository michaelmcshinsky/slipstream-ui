'use client';

import * as React from 'react';
import { Button } from '@slipstream-ui/core';
import { cn } from '@slipstream-ui/core';

export type ConfirmationStatus = 'pending' | 'approved' | 'rejected';

export type ConfirmationVariant = 'default' | 'warning' | 'destructive' | 'info' | 'success';

/** Button variants accepted for the approve/reject actions (Button's variant union). */
export type ConfirmationActionVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

export type ConfirmationProps = {
  /** Human-readable summary of the action requiring approval. */
  title: string;
  /** Optional detail: affected resource, arguments preview, risk note. */
  description?: string;
  /** Tool or action name shown as a mono chip. */
  toolName?: string;
  /** Controlled outcome; omit for fully interactive uncontrolled use. */
  status?: ConfirmationStatus;
  /** Accent color of the pending card (outcome chips always follow the result). */
  variant?: ConfirmationVariant;
  onApprove?: () => void;
  onReject?: () => void;
  /** Button styling for the approve/reject actions. */
  approveVariant?: ConfirmationActionVariant;
  rejectVariant?: ConfirmationActionVariant;
  /** Hide the action buttons (controlled-only gate; status drives the chip). */
  showActions?: boolean;
  labels?: {
    approve?: string;
    reject?: string;
    approved?: string;
    rejected?: string;
  };
  className?: string;
};

const statusChipClasses: Record<ConfirmationStatus, string> = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  approved: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
};

const pendingVariantClasses: Record<ConfirmationVariant, string> = {
  default: 'border-warning/40',
  warning: 'border-warning/40',
  destructive: 'border-destructive/40 bg-destructive/5',
  info: 'border-info/40',
  success: 'border-success/40',
};

/**
 * Human-in-the-loop approval gate for agent actions (tool execution,
 * destructive operations). The agent pauses until the user decides.
 */
const Confirmation = React.forwardRef<HTMLDivElement, ConfirmationProps>(
  (
    {
      title,
      description,
      toolName,
      status: controlledStatus,
      variant = 'default',
      onApprove,
      onReject,
      approveVariant = 'default',
      rejectVariant = 'outline',
      showActions = true,
      labels,
      className,
      ...props
    },
    ref
  ) => {
    const [internalStatus, setInternalStatus] = React.useState<ConfirmationStatus>('pending');
    const status = controlledStatus ?? internalStatus;

    const t = {
      approve: labels?.approve ?? 'Approve',
      reject: labels?.reject ?? 'Reject',
      approved: labels?.approved ?? 'Approved',
      rejected: labels?.rejected ?? 'Rejected',
    };

    const decide = (next: Exclude<ConfirmationStatus, 'pending'>) => {
      setInternalStatus(next);
      (next === 'approved' ? onApprove : onReject)?.();
    };

    return (
      <div
        ref={ref}
        role={status === 'pending' ? 'alertdialog' : undefined}
        aria-label={status === 'pending' ? title : undefined}
        className={cn(
          'rounded-lg border p-4 bg-muted/30 max-w-md',
          status === 'pending' && pendingVariantClasses[variant],
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="text-sm font-medium text-foreground">{title}</div>
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full border whitespace-nowrap',
              statusChipClasses[status]
            )}
          >
            {status === 'approved' ? t.approved : status === 'rejected' ? t.rejected : 'Pending'}
          </span>
        </div>

        {description && (
          <div className="text-sm text-muted-foreground mb-1">{description}</div>
        )}
        {toolName && (
          <div className="text-xs font-mono text-muted-foreground mb-3">{toolName}</div>
        )}

        {status === 'pending' && showActions && (
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant={approveVariant} onClick={() => decide('approved')}>
              {t.approve}
            </Button>
            <Button size="sm" variant={rejectVariant} onClick={() => decide('rejected')}>
              {t.reject}
            </Button>
          </div>
        )}
      </div>
    );
  }
);
Confirmation.displayName = 'Confirmation';

export { Confirmation };
