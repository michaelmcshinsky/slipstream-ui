import * as React from 'react';
import { cn } from '../../utils/cn';
import { Button, type ButtonProps } from '../button/Button';

/** Object form of `action`: EmptyState renders the button/link for you. */
export type EmptyStateAction = {
  label: React.ReactNode;
  onClick?: () => void;
  /** Renders an anchor (styled as a button) instead of a button. */
  href?: string;
  variant?: ButtonProps['variant'];
};

export type EmptyStateProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Icon or illustration shown above the title. */
  icon?: React.ReactNode;
  title: string;
  description?: string;
  /** Primary action: a rendered node, or an action object. */
  action?: React.ReactNode | EmptyStateAction;
  /** Alias for `action` for codebases that pass a list of actions. */
  actions?: React.ReactNode;
  /** Secondary action shown beside the primary one. */
  secondaryAction?: React.ReactNode;
  /** Heading level for the title. Defaults to a paragraph. */
  titleAs?: 'p' | 'h2' | 'h3' | 'h4';
  /** Compact padding for use inside panels and table bodies. */
  size?: 'sm' | 'md';
  /** Horizontal alignment of content and actions. Default 'center'. */
  align?: 'center' | 'start';
  /**
   * Surface treatment. 'panel' renders a tinted, solid-bordered surface for
   * content pages (typically paired with align="start"); 'plain' keeps the
   * default dashed outline. Default 'plain'.
   */
  tone?: 'plain' | 'panel';
  /** Custom link element for action hrefs (Next Link, react-router Link). */
  linkComponent?: React.ElementType;
  /** Prop used to pass the destination to `linkComponent`. */
  linkHrefProp?: 'href' | 'to';
};

function isActionObject(value: unknown): value is EmptyStateAction {
  return (
    typeof value === 'object' &&
    value !== null &&
    !React.isValidElement(value) &&
    'label' in value
  );
}

/** Normalizes the node and object forms into a single element. */
function renderAction(
  action: React.ReactNode | EmptyStateAction | undefined,
  linkComponent?: React.ElementType,
  linkHrefProp: 'href' | 'to' = 'href'
): React.ReactNode {
  if (!isActionObject(action)) return action;
  const { label, onClick, href, variant } = action;
  if (href) {
    const LinkEl = linkComponent ?? 'a';
    const destination = linkHrefProp === 'to' ? { to: href } : { href };
    return (
      <Button variant={variant} asChild>
        <LinkEl {...destination}>{label}</LinkEl>
      </Button>
    );
  }
  return (
    <Button variant={variant} onClick={onClick}>
      {label}
    </Button>
  );
}

/**
 * Placeholder for empty collections, zero-result searches and unconfigured
 * features. Keeps the title/description/action hierarchy consistent across
 * the product.
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  {
    icon,
    title,
    description,
    action,
    actions,
    secondaryAction,
    titleAs: Title = 'p',
    size = 'md',
    align = 'center',
    tone = 'plain',
    linkComponent,
    linkHrefProp = 'href',
    className,
    children,
    ...props
  },
  ref
) {
  const primaryAction = renderAction(action, linkComponent, linkHrefProp) ?? actions;
  const start = align === 'start';
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col rounded-lg text-center',
        start ? 'items-start text-left' : 'items-center text-center',
        'justify-center',
        tone === 'panel'
          ? 'border border-border bg-muted'
          : 'border border-dashed border-border',
        size === 'md' ? 'gap-3 px-6 py-12' : 'gap-2 px-4 py-6',
        className
      )}
      {...props}
    >
      {icon && <div className="text-muted-foreground [&_svg]:size-8">{icon}</div>}
      <Title className={cn('font-semibold', size === 'md' ? 'text-base' : 'text-sm')}>{title}</Title>
      {description && <p className={cn('max-w-sm text-sm text-muted-foreground', start && 'max-w-md')}>{description}</p>}
      {children}
      {(primaryAction || secondaryAction) && (
        <div className={cn('mt-1 flex flex-wrap items-center gap-2', start ? 'justify-start' : 'justify-center')}>
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  );
});
