import React, { forwardRef, ReactNode } from 'react';
import classnames from 'classnames';

export interface CardTitleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}

export const CardTitle = forwardRef<HTMLDivElement, CardTitleProps>(
  (props, ref) => {
    const { className, size, children, ...attributes } = props;
    const classes = classnames(
      'sui--card-title',
      'leading-tight text-gray-700 dark:text-gray-300',
      { 'text-base': size === 'sm' },
      { 'text-lg': size === 'md' || !size },
      { 'text-xl': size === 'lg' },
      className,
    );

    return (
      <h3 ref={ref} className={classes} {...attributes}>
        {children}
      </h3>
    );
  },
);

CardTitle.displayName = 'CardTitle';

export default CardTitle;
