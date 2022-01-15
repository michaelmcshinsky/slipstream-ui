import React, { forwardRef, ReactNode } from 'react';
import classnames from 'classnames';

export interface CardBodyProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  (props, ref) => {
    const { className, size, children, ...attributes } = props;
    const classes = classnames(
      'sui--card-body',
      'text-gray-700 dark:text-gray-300',
      { 'px-3 p-2': size === 'sm' },
      { 'p-3': size === 'md' || !size },
      { 'p-4': size === 'lg' },
      className
    );

    return (
      <div ref={ref} className={classes} {...attributes}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

export default CardBody;
