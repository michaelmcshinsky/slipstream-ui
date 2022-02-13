import React, { forwardRef, ReactNode } from 'react';
import classnames from 'classnames';
import { renderedChildren } from './utils';

export interface CardHeaderProps {
  border?: boolean;
  children?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  (props, ref) => {
    const { border, children, className, size, ...attributes } = props;
    const classes = classnames(
      'sui--card-header p-3 rounded-t',
      'flex items-center dark:bg-gray-900 dark:border-gray-500',
      { 'border-b border-solid': border },
      { 'px-3 py-2': size === 'sm' },
      { 'p-3': size === 'md' || !size },
      { 'p-4': size === 'lg' },
      { 'border-gray-300 dark:border-gray-500': border },
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
