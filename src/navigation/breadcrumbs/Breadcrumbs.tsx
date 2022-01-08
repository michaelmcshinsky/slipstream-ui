import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface BreadcrumbsProps {
  className?: string;
  children: ReactNode;
}

export const Breadcrumbs = forwardRef<HTMLUListElement, BreadcrumbsProps>(
  ({ className, children, ...props }, ref) => {
    const classes = classNames('sui--breadcrumbs', 'flex flex-wrap', className);

    return (
      <ul ref={ref} className={classes} {...props}>
        {children}
      </ul>
    );
  },
);
