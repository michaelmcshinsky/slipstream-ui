import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import { renderedChildren } from './utils';

export type TCardTitle = {
  border?: boolean;
  children?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CardTitle = forwardRef<HTMLDivElement, TCardTitle>(
  (props, ref) => {
    const { border, className, size, children, ...attributes } = props;
    const classes = clsx(
      'sui--card-title',
      'leading-tight text-gray-700',
      { 'text-base': size === 'sm' },
      { 'text-lg': size === 'md' || !size },
      { 'text-xl': size === 'lg' },
      className
    );

    return (
      <h3 ref={ref} className={classes} {...attributes}>
        {renderedChildren({ border, children, size })}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

export default CardTitle;
