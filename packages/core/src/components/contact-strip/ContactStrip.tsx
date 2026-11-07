import * as React from 'react';
import { cn } from '../../utils/cn';

export type ContactItem = {
  label: string;
  value: string;
  href?: string;
  icon?: React.ReactNode;
};

export type ContactStripProps = React.HTMLAttributes<HTMLUListElement> & {
  /** Contact rows to display. */
  items: ContactItem[];
  /** Desktop column count (2-3). Default 2. */
  columns?: 2 | 3;
  /** Content alignment. Default 'left'. */
  align?: 'left' | 'center';
  /** Custom link element for routers. */
  linkComponent?: React.ElementType;
};

const columnClasses: Record<NonNullable<ContactStripProps['columns']>, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
};

/**
 * Compact contact details strip for the end of a marketing page. Each row
 * pairs a short label with a phone, email, address or link.
 */
export const ContactStrip = React.forwardRef<HTMLUListElement, ContactStripProps>(function ContactStrip(
  { items, columns = 2, align = 'left', linkComponent, className, ...props },
  ref
) {
  const Link = linkComponent ?? 'a';

  return (
    <ul ref={ref} className={cn('grid gap-6', columnClasses[columns], className)} {...props}>
      {items.map((item) => (
        <li key={item.label} className={cn('flex min-w-0 items-start gap-3', align === 'center' && 'justify-center text-center')}>
          {item.icon && (
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-4">
              {item.icon}
            </span>
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</p>
            {item.href ? (
              <Link href={item.href} className="mt-0.5 block break-words text-sm font-medium text-primary underline-offset-4 hover:underline">
                {item.value}
              </Link>
            ) : (
              <p className="mt-0.5 break-words text-sm font-medium">{item.value}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
});
