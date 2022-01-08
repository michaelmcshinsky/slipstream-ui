import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface TagProps {
  className?: string;
  children: ReactNode;
  bg?: string;
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
  size?: 'sm' | 'md' | 'lg';
  rounded?: string;
  block?: boolean;
}

export const Tag = forwardRef<HTMLDivElement, TagProps>(
  (
    { children, className, color, shade, size, block, rounded, bg, ...props },
    ref,
  ) => {
    const classes = classNames(
      'leading-tight',
      block ? 'block' : 'inline',
      rounded ? `rounded-${rounded}` : 'rounded-sm',
      color && color === 'white'
        ? 'text-white'
        : color === 'black'
        ? 'text-black'
        : `text-${color}-900`,
      `bg-${bg}${bg === 'black' || bg === 'white' ? '' : `-${shade}`}`,
      { 'text-xs px-1.5 py-1': size === 'sm' },
      { 'text-sm px-2 py-1': size === 'md' || !size },
      { 'text-base px-2.5 py-1.5': size === 'lg' },
      className,
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

Tag.displayName = 'Tag';
Tag.defaultProps = {
  color: 'gray',
  bg: 'gray',
  size: 'sm',
  shade: '200',
};

export default Tag;
