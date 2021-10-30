import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface TagProps {
  className?: string;
  children?: ReactNode;
  bg?: string;
  color?: string;
  shade?: string | number;
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  block?: boolean;
}

export const Tag = forwardRef<HTMLDivElement, TagProps>(
  (
    { children, className, color, shade, size, block, rounded, bg, ...props },
    ref
  ) => {
    const classes = classNames(
      'leading-tight',
      block ? 'block' : 'inline',
      { 'rounded-sm': rounded },
      color && color === 'white'
        ? 'text-white'
        : color === 'black'
        ? 'text-black'
        : `text-${color}-900`,
      bg ? `bg-${bg}-${shade || '200'}` : 'bg-gray-200',
      { 'text-xs px-1.5 py-1': size === 'sm' },
      { 'text-sm px-2 py-1': size === 'md' || !size },
      { 'text-base px-2.5 py-1.5': size === 'lg' },
      className
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Tag.displayName = 'Tag';
Tag.defaultProps = {};

export default Tag;
