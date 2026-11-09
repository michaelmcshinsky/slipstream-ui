import * as React from 'react';
import { cn } from '../../utils/cn';
import { Badge } from '../badge/Badge';
import { Button } from '../button/Button';
import { Card, CardContent, CardFooter, CardHeader } from '../card/Card';

export type DealMetric = {
  label: string;
  value: string;
};

export type DealStatus = 'available' | 'under-nda' | 'closed' | 'draft';

export type DealCardProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {
  /** Deal headline. */
  title: string;
  /** Sector or industry label. */
  sector: string;
  /** Region or location. */
  location?: string;
  /** Optional short summary. */
  description?: string;
  /** Three headline metrics such as revenue, EBITDA and margin. */
  metrics: DealMetric[];
  /** Availability state. Default 'available'. */
  status?: DealStatus;
  /** Show the NDA badge. */
  ndaAvailable?: boolean;
  /** Show the CIM badge. */
  cimAvailable?: boolean;
  /** Optional deal detail link. */
  href?: string;
  /** Custom link element for routers. */
  linkComponent?: React.ElementType;
  /** Save toggle state. */
  saved?: boolean;
  onSave?: () => void;
  /** Save button label. Default "Save". */
  saveLabel?: string;
  /** Request access handler. */
  onRequestAccess?: () => void;
  /** Request access label. Default "Request access". */
  requestLabel?: string;
};

const statusConfig: Record<DealStatus, { label: string; variant: 'success' | 'info' | 'secondary' | 'outline' }> = {
  available: { label: 'Available', variant: 'success' },
  'under-nda': { label: 'Under NDA', variant: 'info' },
  closed: { label: 'Closed', variant: 'secondary' },
  draft: { label: 'Draft', variant: 'outline' },
};

/**
 * Deal opportunity card for trend, search and saved-deal surfaces. Metrics use
 * tabular numerals; NDA and CIM access are stated as text badges, not implied.
 */
export const DealCard = React.forwardRef<HTMLElement, DealCardProps>(function DealCard(
  {
    title,
    sector,
    location,
    description,
    metrics,
    status = 'available',
    ndaAvailable,
    cimAvailable,
    href,
    linkComponent,
    saved = false,
    onSave,
    saveLabel = 'Save',
    onRequestAccess,
    requestLabel = 'Request access',
    className,
    ...props
  },
  ref
) {
  const Link = linkComponent ?? 'a';
  const statusInfo = statusConfig[status];

  return (
    <Card ref={ref as never} className={cn('flex h-full flex-col overflow-hidden', className)} {...props}>
      <CardHeader className="gap-2 p-5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{sector}</p>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
        <h3 className="text-lg font-semibold leading-snug tracking-tight">
          {href ? (
            <Link href={href} className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        {location && <p className="text-xs text-muted-foreground">{location}</p>}
      </CardHeader>
      <CardContent className="flex-1 px-5 pb-3">
        {description && <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{description}</p>}
        <dl className="mt-4 grid grid-cols-3 gap-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="min-w-0">
              <dt className="text-xs text-muted-foreground">{metric.label}</dt>
              <dd className="mt-0.5 truncate text-sm font-semibold tabular-nums">{metric.value}</dd>
            </div>
          ))}
        </dl>
        {(ndaAvailable || cimAvailable) && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {ndaAvailable && <Badge variant="info">NDA available</Badge>}
            {cimAvailable && <Badge variant="secondary">CIM available</Badge>}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-2 border-t border-border px-5 py-3">
        {onRequestAccess && (
          <Button type="button" size="sm" onClick={onRequestAccess}>
            {requestLabel}
          </Button>
        )}
        {onSave && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            aria-pressed={saved}
            onClick={onSave}
            className="ml-auto"
          >
            {saved ? 'Saved' : saveLabel}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
});
