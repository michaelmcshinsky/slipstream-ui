import * as React from 'react';
import { cn } from '../../utils/cn';

export type LogoItem = {
  /** Accessible name announced for the logo. */
  name: string;
  /** Logo artwork. Mark the image decorative so the name is not duplicated. */
  logo: React.ReactNode;
  /** Optional destination. */
  href?: string;
};

export type LogoCloudProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Logos to display. */
  items: LogoItem[];
  /** Caption above the strip. */
  caption?: string;
  /** Desktop column count (3-6). Default 4. */
  columns?: 3 | 4 | 5 | 6;
  /** Desaturate logos until hover. Default true. */
  grayscale?: boolean;
  /** Logo box height. Default 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** Caption and grid alignment. Default 'center'. */
  align?: 'left' | 'center';
  /** Custom link element for routers. */
  linkComponent?: React.ElementType;
};

const columnClasses: Record<NonNullable<LogoCloudProps['columns']>, string> = {
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
};

const sizeClasses: Record<NonNullable<LogoCloudProps['size']>, string> = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-12',
};

/**
 * Trust strip for member, customer or partner logos. Logos are decorative
 * slots; the item name supplies the accessible text. Use it inside a Section
 * so the surface tone and spacing come from the band.
 */
export const LogoCloud = React.forwardRef<HTMLDivElement, LogoCloudProps>(function LogoCloud(
  {
    items,
    caption,
    columns = 4,
    grayscale = true,
    size = 'md',
    align = 'center',
    linkComponent,
    className,
    ...props
  },
  ref
) {
  const Link = linkComponent ?? 'a';
  const logoClass = cn(
    'flex items-center transition duration-200 motion-reduce:transition-none',
    sizeClasses[size],
    grayscale && 'opacity-70 grayscale hover:opacity-100 hover:grayscale-0'
  );

  return (
    <div ref={ref} className={cn('w-full', className)} {...props}>
      {caption && (
        <p
          className={cn(
            'mb-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground',
            align === 'center' && 'text-center'
          )}
        >
          {caption}
        </p>
      )}
      <ul className={cn('grid items-center gap-x-8 gap-y-6', columnClasses[columns], align === 'center' && 'justify-items-center')}>
        {items.map((item) => {
          const content = (
            <>
              <span className={logoClass} aria-hidden="true">
                {item.logo}
              </span>
              <span className="sr-only">{item.name}</span>
            </>
          );

          return (
            <li key={item.name} className={cn('min-w-0', align === 'center' ? 'justify-self-center' : 'justify-self-start')}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {content}
                </Link>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
});
