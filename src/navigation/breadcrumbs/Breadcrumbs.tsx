import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TBreadcrumbs = {
  className?: string;
  children?: ReactNode;
};

export const Breadcrumbs = forwardRef<HTMLUListElement, TBreadcrumbs>(
  ({ className, children, ...props }, ref) => {
    const classes = clsx('sui--breadcrumbs', 'flex flex-wrap', className);

    return (
      <ul ref={ref} className={classes} {...props}>
        {children}
      </ul>
    );
  }
);
