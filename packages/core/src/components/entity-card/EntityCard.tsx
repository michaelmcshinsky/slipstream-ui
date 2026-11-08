import * as React from 'react';
import { cn } from '../../utils/cn';
import { Avatar, AvatarFallback } from '../avatar/Avatar';
import { Badge } from '../badge/Badge';
import { Card, CardContent, CardFooter, CardHeader } from '../card/Card';

export type EntityStat = {
  label: string;
  value: string;
};

export type EntityCardProps = React.HTMLAttributes<HTMLElement> & {
  /** Firm or member name. */
  name: string;
  /** Firm type, role or member category. */
  entityType: string;
  /** Region or office location. */
  location?: string;
  /** Short firm description. */
  description?: string;
  /** Logo slot. Falls back to initials when omitted. */
  logo?: React.ReactNode;
  /** Small stats such as closed deals or active mandates. */
  stats?: EntityStat[];
  /** Sector or service tags. */
  tags?: string[];
  /** Profile destination. */
  href?: string;
  /** Custom link element for routers. */
  linkComponent?: React.ElementType;
  /** Extra footer actions. */
  actions?: React.ReactNode;
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * Firm or member profile card for a directory. Use the logo slot for a brand
 * mark; when absent, initials keep the card identifiable. Stats and tags are
 * optional, so the same card works in compact and detailed directory views.
 */
export const EntityCard = React.forwardRef<HTMLElement, EntityCardProps>(function EntityCard(
  {
    name,
    entityType,
    location,
    description,
    logo,
    stats,
    tags,
    href,
    linkComponent,
    actions,
    className,
    ...props
  },
  ref
) {
  const Link = linkComponent ?? 'a';

  return (
    <Card ref={ref as never} className={cn('flex h-full flex-col', className)} {...props}>
      <CardHeader className="flex-row items-start gap-3 p-5 pb-3">
        <div className="shrink-0">
          {logo ?? (
            <Avatar>
              <AvatarFallback>{initials(name)}</AvatarFallback>
            </Avatar>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold tracking-tight">
            {href ? (
              <Link href={href} className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {name}
              </Link>
            ) : (
              name
            )}
          </h3>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{entityType}</p>
          {location && <p className="mt-0.5 truncate text-xs text-muted-foreground">{location}</p>}
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-5 pb-3">
        {description && <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{description}</p>}
        {tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {stats && stats.length > 0 && (
          <dl className="mt-4 grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                <dd className="mt-0.5 truncate text-sm font-semibold tabular-nums">{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </CardContent>
      {(href || actions) && (
        <CardFooter className="flex flex-wrap items-center gap-2 border-t border-border px-5 py-3">
          {href && (
            <Link
              href={href}
              className="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              View profile
            </Link>
          )}
          {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
        </CardFooter>
      )}
    </Card>
  );
});

/** Alias for profile-oriented directory surfaces. */
export const ProfileCard = EntityCard;
export type ProfileCardProps = EntityCardProps;
