import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface BreadcrumbProps {
  className?: string;
  children: ReactNode;
}

export const Breadcrumb = forwardRef<HTMLUListElement, BreadcrumbProps>(
  ({ className, children, ...props }, ref) => {
    const classes = classNames('sui--breadcrumbs-crumb', className);

    return (
      <ul ref={ref} className={classes} {...props}>
        {children}
      </ul>
    );
  },
);
