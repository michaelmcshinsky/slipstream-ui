import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TTableHead = {
  className?: string;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  borderless?: boolean;
  custom?: boolean;
};

export const TableHead = forwardRef<HTMLTableSectionElement, TTableHead>(
  ({ className, children, size, borderless, custom, ...props }, ref) => {
    const renderedChildren = React.Children.toArray(children)
      .filter(Boolean)
      .map((child: any) => {
        if (child?.type?.displayName?.includes?.('Table')) {
          return React.cloneElement(child, {
            size,
            borderless,
            custom,
          });
        }
        return child;
      });

    const classes = clsx(
      'sui--table-thead',
      !custom && 'table-head-group',
      className
    );

    return (
      <thead ref={ref} className={classes} {...props}>
        {renderedChildren}
      </thead>
    );
  }
);

TableHead.displayName = 'TableHead';
TableHead.defaultProps = {
  size: 'md',
};

export default TableHead;
