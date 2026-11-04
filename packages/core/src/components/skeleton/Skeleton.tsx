import * as React from 'react';
import { cn } from '../../utils/cn';

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const;

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Tailwind height class for the block (e.g. 'h-4'). */
  height?: string;
  /** Tailwind width class for the block (e.g. 'w-48', 'w-full'). */
  width?: string;
  /** Corner rounding preset (default 'md'). */
  rounded?: keyof typeof roundedClasses;
};

/**
 * Loading placeholder that mirrors the shape of upcoming content.
 * Sizing lives on props (height/width/rounded) instead of ad-hoc
 * className strings. Marked `aria-hidden` so screen readers skip it —
 * pair with a live-region status elsewhere to announce loading.
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, height, width, rounded = 'md', ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'animate-pulse bg-muted motion-reduce:animate-none',
        roundedClasses[rounded],
        height,
        width,
        className
      )}
      {...props}
    />
  )
);
Skeleton.displayName = 'Skeleton';

export { Skeleton };
