import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import { renderedChildren } from './utils';

export type TCardFooter = {
  border?: boolean;
  children?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CardFooter = forwardRef<HTMLDivElement, TCardFooter>(
  (props, ref) => {
    const { border, children, className, size, ...attributes } = props;
    const classes = clsx(
      'sui--card-footer',
      'text-gray-700',
      'p-3 rounded-b flex items-center',
      { 'border-t border-solid': border },
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

CardFooter.displayName = 'CardFooter';
CardFooter.defaultProps = {
  border: true,
};

export default CardFooter;
