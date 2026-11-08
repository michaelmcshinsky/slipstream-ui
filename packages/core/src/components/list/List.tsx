import * as React from 'react';
import { cn } from '../../utils/cn';

export type ListProps = React.HTMLAttributes<HTMLUListElement> & {
  /** Hairline dividers between rows. */
  divided?: boolean;
  /** Card-like surface and border around the list. */
  bordered?: boolean;
  /** Row density. */
  size?: 'default' | 'compact';
};

/**
 * Semantic list container for groups of related rows (settings, results,
 * nav items). Renders a real <ul> so screen readers announce item counts;
 * pair with ListItem rows.
 */
const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ divided, bordered, size = 'default', className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn(
        'flex flex-col',
        bordered && 'overflow-hidden rounded-lg border border-border bg-card',
        divided && 'divide-y divide-border',
        size === 'compact' ? 'gap-0' : 'gap-0',
        className
      )}
      {...props}
    />
  )
);
List.displayName = 'List';

export type ListItemProps = React.LiHTMLAttributes<HTMLLIElement> & {
  /** Leading slot: icon, avatar, status dot, or checkbox. */
  leading?: React.ReactNode;
  /** Trailing slot: chevron, badge, meta, or action. */
  trailing?: React.ReactNode;
  /** Marks the row as the active/selected item. */
  selected?: boolean;
  /**
   * Makes the row pressable. The content renders inside a full-width
   * <button> so list semantics (ul > li) stay intact for assistive tech.
   */
  onClick?: () => void;
  /** Secondary line under the main content; accepts rich meta (badges, dots). */
  description?: React.ReactNode;
  /** Disables a pressable row. */
  disabled?: boolean;
};

/** A single row inside a List. */
const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ leading, trailing, selected, onClick, description, disabled, className, children, ...props }, ref) => {
    const padding = 'px-3 py-2.5';
    const rowClass = cn(
      'flex w-full items-center gap-3 text-left text-sm',
      selected && 'bg-accent text-accent-foreground',
      onClick && !disabled && 'hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      disabled && 'opacity-50',
      className
    );

    const body = (
      <>
        {leading && <span className="flex shrink-0 items-center">{leading}</span>}
        <span className="min-w-0 flex-1">
          <span className="block truncate">{children}</span>
          {description && (
            <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
          )}
        </span>
        {trailing && <span className="flex shrink-0 items-center text-xs text-muted-foreground">{trailing}</span>}
      </>
    );

    return (
      <li ref={ref} {...props}>
        {onClick ? (
          <button type="button" onClick={onClick} disabled={disabled} className={cn(padding, rowClass)}>
            {body}
          </button>
        ) : (
          <div className={cn(padding, rowClass)}>{body}</div>
        )}
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';

export { List, ListItem };
