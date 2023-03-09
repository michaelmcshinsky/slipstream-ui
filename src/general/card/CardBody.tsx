import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import { renderedChildren } from './utils';

export type TCardBody = {
  border?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}

export const CardBody = forwardRef<HTMLDivElement, TCardBody>(
  (props, ref) => {
    const { border, className, size, children, ...attributes } = props;
    const classes = clsx(
      'sui--card-body',
      'text-gray-700',
      { 'px-3 p-2': size === 'sm' },
      { 'p-3': size === 'md' || !size },
      { 'p-4': size === 'lg' },
      className
    );

    return (
      <div ref={ref} className={classes} {...attributes}>
        {renderedChildren({ border, children, size })}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

export default CardBody;
