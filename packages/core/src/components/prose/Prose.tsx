import * as React from 'react';
import { cn } from '../../utils/cn';

export type ProseProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Type scale. Default 'md'. */
  size?: 'sm' | 'md' | 'lg';
};

const sizeClasses: Record<NonNullable<ProseProps['size']>, string> = {
  sm: 'text-sm [&_h2]:text-xl [&_h3]:text-lg',
  md: 'text-base [&_h2]:text-2xl [&_h3]:text-xl',
  lg: 'text-lg [&_h2]:text-3xl [&_h3]:text-2xl',
};

/**
 * Long-form content typography for rendered markdown/MDX output.
 *
 * Self-contained (no @tailwindcss/typography dependency): element styles ride
 * on child selectors, so any MDX/remark renderer can drop its output inside.
 * Keeps the content pipeline (Shiki, KaTeX, Mermaid) untouched.
 */
export const Prose = React.forwardRef<HTMLDivElement, ProseProps>(function Prose(
  { size = 'md', className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'max-w-none text-foreground',
        sizeClasses[size],
        // Headings
        '[&_h1]:mb-4 [&_h1]:mt-10 [&_h1]:scroll-mt-24 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight',
        '[&_h2]:mb-3 [&_h2]:mt-9 [&_h2]:scroll-mt-24 [&_h2]:font-semibold [&_h2]:tracking-tight',
        '[&_h3]:mb-2 [&_h3]:mt-7 [&_h3]:scroll-mt-24 [&_h3]:font-semibold',
        '[&_h4]:mb-2 [&_h4]:mt-6 [&_h4]:scroll-mt-24 [&_h4]:font-semibold',
        // Body copy
        '[&_p]:my-4 [&_p]:leading-7',
        '[&_a]:text-primary [&_a]:underline [&_a]:decoration-primary/40 [&_a]:underline-offset-4 hover:[&_a]:decoration-primary',
        '[&_strong]:font-semibold [&_strong]:text-foreground [&_em]:italic',
        '[&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6',
        '[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-6',
        '[&_li]:leading-7 [&_li>p]:my-0',
        '[&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground',
        // Code
        '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.875em]',
        '[&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/50 [&_pre]:p-4',
        '[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm',
        // Media, rules, tables
        '[&_hr]:my-8 [&_hr]:border-border',
        '[&_img]:my-6 [&_img]:rounded-lg [&_img]:border [&_img]:border-border',
        '[&_figure]:my-6 [&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-xs [&_figcaption]:text-muted-foreground',
        '[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm',
        '[&_th]:border-b [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold',
        '[&_td]:border-b [&_td]:border-border [&_td]:px-3 [&_td]:py-2',
        className
      )}
      {...props}
    />
  );
});
