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
function renderAction(action: React.ReactNode | EmptyStateAction | undefined): React.ReactNode {
  if (!isActionObject(action)) return action;
  const { label, onClick, href, variant } = action;
  if (href) {
    return (
      <Button variant={variant} asChild>
        <a href={href}>{label}</a>
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
    className,
    children,
    ...props
  },
  ref
) {
  const primaryAction = renderAction(action) ?? actions;
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-border text-center',
        size === 'md' ? 'gap-3 px-6 py-12' : 'gap-2 px-4 py-6',
        className
      )}
      {...props}
    >
      {icon && <div className="text-muted-foreground [&_svg]:size-8">{icon}</div>}
      <Title className={cn('font-semibold', size === 'md' ? 'text-base' : 'text-sm')}>{title}</Title>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {children}
      {(primaryAction || secondaryAction) && (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  );
});
