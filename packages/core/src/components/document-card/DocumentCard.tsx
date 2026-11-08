import * as React from 'react';
import { cn } from '../../utils/cn';
import { Badge } from '../badge/Badge';
import { Button } from '../button/Button';
import { Card, CardContent } from '../card/Card';

export type DocumentStatus = 'available' | 'restricted' | 'pending';

export type DocumentCardProps = React.HTMLAttributes<HTMLElement> & {
  /** File name. */
  name: string;
  /** Short file type label, such as PDF or XLSX. */
  fileType: string;
  /** Human-readable file size. */
  size?: string;
  /** Updated date or relative time. */
  updatedAt?: string;
  /** Access state. Default 'available'. */
  status?: DocumentStatus;
  /** Download handler. Omit to render a display-only row. */
  onDownload?: () => void;
  /** Download button label. Default "Download". */
  downloadLabel?: string;
  /** Custom file icon slot. */
  icon?: React.ReactNode;
};

const statusConfig: Record<DocumentStatus, { label: string; variant: 'success' | 'warning' | 'info' }> = {
  available: { label: 'Available', variant: 'success' },
  restricted: { label: 'Restricted', variant: 'warning' },
  pending: { label: 'Pending', variant: 'info' },
};

/**
 * Document row for a deal room or diligence list. The row states the access
 * status and only exposes the download action when a handler is provided.
 */
export const DocumentCard = React.forwardRef<HTMLElement, DocumentCardProps>(function DocumentCard(
  {
    name,
    fileType,
    size,
    updatedAt,
    status = 'available',
    onDownload,
    downloadLabel = 'Download',
    icon,
    className,
    ...props
  },
  ref
) {
  const statusInfo = statusConfig[status];
  const meta = [fileType, size, updatedAt].filter(Boolean).join(' · ');

  return (
    <Card ref={ref as never} className={cn('w-full', className)} {...props}>
      <CardContent className="flex items-center gap-3 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-5">
          {icon ?? <span className="text-[10px] font-bold uppercase tracking-wide">{fileType}</span>}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{name}</p>
          {meta && <p className="mt-0.5 truncate text-xs text-muted-foreground">{meta}</p>}
        </div>
        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        {onDownload && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDownload}
            disabled={status !== 'available'}
            aria-label={`${downloadLabel} ${name}`}
          >
            {downloadLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
});
