'use client';

import * as React from 'react';
import { Button } from '@slipstream-ui/core';
import { cn } from '@slipstream-ui/core';

export type ConfirmationStatus = 'pending' | 'approved' | 'rejected';

export interface ConfirmationProps {
  /** Human-readable summary of the action requiring approval. */
  title: string;
  /** Optional detail: affected resource, arguments preview, risk note. */
  description?: string;
  /** Tool or action name shown as a mono chip. */
  toolName?: string;
  /** Controlled outcome; omit for fully interactive uncontrolled use. */
  status?: ConfirmationStatus;
  onApprove?: () => void;
  onReject?: () => void;
  labels?: {
    approve?: string;
    reject?: string;
    approved?: string;
    rejected?: string;
  };
  className?: string;
}

const statusChipClasses: Record<ConfirmationStatus, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  approved: 'bg-green-500/10 text-green-500 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
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
      onApprove,
      onReject,
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
          status === 'pending' && 'border-yellow-500/40',
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

        {status === 'pending' && (
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={() => decide('approved')}>
              {t.approve}
            </Button>
            <Button size="sm" variant="outline" onClick={() => decide('rejected')}>
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
