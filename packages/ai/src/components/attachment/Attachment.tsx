import * as React from 'react';
import { cn } from '@slipstream-ui/core';

/** A single file attached to a message or prompt. Display-only; upload logic stays consumer-side. */
export interface AttachmentItem {
  id: string;
  /** File name, including extension. */
  name: string;
  /** Human-readable size, e.g. "2.4 MB". */
  size?: string;
  /** MIME type or simple kind used for the chip label. */
  type?: string;
  /** Optional image thumbnail URL. */
  previewUrl?: string;
  status?: 'uploading' | 'done' | 'error';
}

export interface AttachmentProps {
  attachment: AttachmentItem;
  /** Called when the user removes the attachment; omit to hide the remove control. */
  onRemove?: (attachment: AttachmentItem) => void;
  className?: string;
}

const Attachment = React.forwardRef<HTMLDivElement, AttachmentProps>(
  ({ attachment, onRemove, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2 rounded-md border border-border bg-muted/50 px-2 py-1.5 text-sm max-w-xs',
          className
        )}
        {...props}
      >
        {attachment.previewUrl ? (
          <img
            src={attachment.previewUrl}
            alt=""
            aria-hidden="true"
            className="h-8 w-8 rounded object-cover flex-shrink-0"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded bg-secondary text-[10px] font-semibold uppercase text-secondary-foreground flex-shrink-0"
          >
            {(attachment.type ?? attachment.name.split('.').pop() ?? '?').slice(0, 4)}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="truncate font-medium text-foreground" title={attachment.name}>
            {attachment.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {attachment.status === 'uploading'
              ? 'Uploading...'
              : [attachment.size, attachment.type].filter(Boolean).join(' · ') || null}
          </div>
        </div>

        {attachment.status === 'uploading' && (
          <span
            role="status"
            aria-label="Uploading"
            className="h-3 w-3 flex-shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent text-muted-foreground"
          />
        )}

        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(attachment)}
            aria-label={`Remove ${attachment.name}`}
            className="flex-shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            ✕
          </button>
        )}
      </div>
    );
  }
);
Attachment.displayName = 'Attachment';

export { Attachment };
