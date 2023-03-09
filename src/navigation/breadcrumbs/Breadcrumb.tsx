import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TBreadcrumb = {
  className?: string;
  children?: ReactNode;
}

export const Breadcrumb = forwardRef<HTMLUListElement, TBreadcrumb>(
  ({ className, children, ...props }, ref) => {
    const classes = clsx('sui--breadcrumbs-crumb', className);

    return (
      <ul ref={ref} className={classes} {...props}>
        {children}
      </ul>
    );
  },
);
