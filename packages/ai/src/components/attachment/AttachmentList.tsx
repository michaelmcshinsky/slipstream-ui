import * as React from 'react';
import { cn } from '@slipstream-ui/core';
import { Attachment } from './Attachment';
import type { AttachmentItem } from './Attachment';

export interface AttachmentListProps {
  attachments: AttachmentItem[];
  /** Passed through to every Attachment; omit to hide remove controls. */
  onRemove?: (attachment: AttachmentItem) => void;
  className?: string;
}

const AttachmentList = React.forwardRef<HTMLDivElement, AttachmentListProps>(
  ({ attachments, onRemove, className, ...props }, ref) => {
    if (attachments.length === 0) {
      return null;
    }

    return (
      <div ref={ref} className={cn('flex flex-wrap gap-2', className)} {...props}>
        {attachments.map((attachment) => (
          <Attachment key={attachment.id} attachment={attachment} onRemove={onRemove} />
        ))}
      </div>
    );
  }
);
AttachmentList.displayName = 'AttachmentList';

export { AttachmentList };
