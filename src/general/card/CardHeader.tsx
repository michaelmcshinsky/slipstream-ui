import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import { renderedChildren } from './utils';

export type TCardHeader = {
  border?: boolean;
  children?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CardHeader = forwardRef<HTMLDivElement, TCardHeader>(
  (props, ref) => {
    const { border, children, className, size, ...attributes } = props;
    const classes = clsx(
      'sui--card-header p-3 rounded-t',
      'flex items-center',
      { 'border-b border-solid': border },
      { 'px-3 py-2': size === 'sm' },
      { 'p-3': size === 'md' || !size },
      { 'p-4': size === 'lg' },
      { 'border-gray-300': border },
      className
    );

    return (
      <div ref={ref} className={classes} {...attributes}>
        {renderedChildren({ border, children, size })}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';
CardHeader.defaultProps = {
  border: true,
};

export default CardHeader;
