import React, { forwardRef } from 'react';
import clsx from 'clsx';

export type TProgress = {
  className?: string;
  rounded?: boolean;
  percent?: string | number;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  shade?:
    | '50'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | string
    | number;
}

export const Progress = forwardRef<HTMLDivElement, TProgress>(
  (
    { className, rounded, percent, animate, size, color, shade, ...props },
    ref,
  ) => {
    const classes = clsx(
      'w-full bg-gray-200',
      { 'rounded-full': rounded },
      { 'h-1.5': size === 'sm' },
      { 'h-2.5': size === 'md' || !size },
      { 'h-4': size === 'lg' },
      className,
    );

    const innerClasses = clsx(
      'w-full h-full ease-in-out duration-700',
      color ? `bg-${color}${color === 'black' || color === 'white' ? '' : `-${shade}`}` : 'bg-blue-500',
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
  color: 'blue',
  shade: '500',
};

export default Progress;
