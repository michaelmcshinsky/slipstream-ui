import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TTableCol = {
  className?: string;
  children?: ReactNode;
  span?: number;
  custom?: boolean;
}

export const TableCol = forwardRef<HTMLTableColElement, TTableCol>(
  ({ className, children, custom, ...props }, ref) => {
    const classes = clsx('sui--table-colgroup_col', className);

    return <col ref={ref} className={classes} {...props} />;
  }
);

TableCol.displayName = 'TableCol';

export default TableCol;
