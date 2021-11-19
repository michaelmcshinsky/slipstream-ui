import React, { forwardRef, ReactNode } from 'react';

export interface BreadcrumbsProps {
  children?: ReactNode
}

export const Breadcrumbs = forwardRef<HTMLUListElement>(
  ({ children, ...props }, ref) => {
    return <ul ref={ref} {...props}>{children}</ul>;
  }
);
