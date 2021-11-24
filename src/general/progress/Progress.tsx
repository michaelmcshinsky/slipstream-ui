import React, { forwardRef } from 'react';
import classNames from 'classnames';

export interface ProgressProps {
  className?: string;
  rounded?: boolean;
  percent?: string | number;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  shade?: string | number;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    { className, rounded, percent, animate, size, color, shade, ...props },
    ref,
  ) => {
    const classes = classNames(
      'w-full bg-gray-200',
      { 'rounded-full': rounded },
      { 'h-1.5': size === 'sm' },
      { 'h-2.5': size === 'md' || !size },
      { 'h-4': size === 'lg' },
      className,
    );

    const innerClasses = classNames(
      'w-full h-full ease-in-out duration-700',
      color ? `bg-${color}-${shade || '500'}` : 'bg-blue-500',
      { 'animate-pulse': animate },
      { 'rounded-full': rounded },
    );
    const maxWidth = percent ? `${percent}%` : 0;
    const styles = { maxWidth };

    return (
      <div ref={ref} className={classes} {...props}>
        <div className={innerClasses} style={styles}></div>
      </div>
    );
  },
);

Progress.displayName = 'Progress';
Progress.defaultProps = {
  rounded: true,
};

export default Progress;
