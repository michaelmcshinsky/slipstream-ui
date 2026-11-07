import * as React from 'react';
import { cn } from '../../utils/cn';

export type TestimonialProps = React.HTMLAttributes<HTMLElement> & {
  /** The testimonial copy, without quotation marks. */
  quote: string;
  /** Person or company name. */
  name: string;
  /** Role or title. */
  role?: string;
  /** Company name. */
  company?: string;
  /** Avatar slot (usually Avatar). */
  avatar?: React.ReactNode;
  /** Brand or logo slot shown in the card header. */
  logo?: React.ReactNode;
  /** Card surface or plain quote. Default 'card'. */
  variant?: 'card' | 'plain';
  /** Quote scale. Default 'md'. */
  size?: 'sm' | 'md' | 'lg';
};

const quoteSizes = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl sm:text-2xl',
} as const;

/**
 * Semantic testimonial: figure + blockquote + figcaption. Use it for written
 * proof on landing and review pages, not for app feedback prompts.
 */
export const Testimonial = React.forwardRef<HTMLElement, TestimonialProps>(function Testimonial(
  { quote, name, role, company, avatar, logo, variant = 'card', size = 'md', className, ...props },
  ref
) {
  return (
    <figure
      ref={ref as never}
      className={cn(
        'flex h-full flex-col gap-5',
        variant === 'card' && 'rounded-xl border border-border bg-card p-6 shadow-sm',
        className
      )}
      {...props}
    >
      {logo && <div className="flex items-center">{logo}</div>}
      <blockquote className={cn('flex-1 leading-relaxed', quoteSizes[size])}>
        <p>“{quote}”</p>
      </blockquote>
      <figcaption className="flex items-center gap-3">
        {avatar && <div className="shrink-0">{avatar}</div>}
        <div className="min-w-0">
          <p className="text-sm font-semibold">{name}</p>
          {(role || company) && (
            <p className="text-xs text-muted-foreground">
              {[role, company].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
      </figcaption>
    </figure>
  );
});
