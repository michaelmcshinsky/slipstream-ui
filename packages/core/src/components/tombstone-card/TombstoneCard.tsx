import * as React from 'react';
import { cn } from '../../utils/cn';
import { Badge } from '../badge/Badge';
import { Card, CardContent } from '../card/Card';

export type TombstoneStatus = 'archived' | 'unavailable' | 'closed';

export type TombstoneCardProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {
  /** Listing, deal or document name. */
  title: string;
  /** Why the item is unavailable. */
  reason?: string;
  /** Unavailable state. Default 'unavailable'. */
  status?: TombstoneStatus;
  /** Logo or document icon slot. */
  logo?: React.ReactNode;
  /** Optional detail destination. */
  href?: string;
  /** Link label. Default "View details". */
  actionLabel?: string;
  /** Custom link element for routers. */
  linkComponent?: React.ElementType;
};

const statusConfig: Record<TombstoneStatus, { label: string; variant: 'secondary' | 'warning' | 'outline' }> = {
  archived: { label: 'Archived', variant: 'secondary' },
  unavailable: { label: 'Unavailable', variant: 'warning' },
  closed: { label: 'Closed', variant: 'outline' },
};

/**
 * Placeholder card for archived, closed or unavailable marketplace items. It
 * explains why the item is unavailable instead of silently removing it from a
 * list or leaving a broken detail link.
 */
export const TombstoneCard = React.forwardRef<HTMLElement, TombstoneCardProps>(function TombstoneCard(
  {
    title,
    reason,
    status = 'unavailable',
    logo,
    href,
    actionLabel = 'View details',
    linkComponent,
    className,
    ...props
  },
  ref
) {
  const Link = linkComponent ?? 'a';
  const statusInfo = statusConfig[status];

  return (
    <Card
      ref={ref as never}
      className={cn('flex h-full flex-col border-dashed bg-muted/30 shadow-none', className)}
      {...props}
    >
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          {logo && <div className="min-w-0 opacity-70">{logo}</div>}
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
        <h3 className="text-base font-semibold tracking-tight text-foreground/80">{title}</h3>
        {reason && <p className="text-sm leading-relaxed text-muted-foreground">{reason}</p>}
        {href && (
          <Link
            href={href}
            className="mt-auto text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {actionLabel}
          </Link>
        )}
      </CardContent>
    </Card>
  );
});
