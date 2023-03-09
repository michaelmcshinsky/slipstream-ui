import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TTableColGroup = {
  className?: string;
  children?: ReactNode;
  span?: number;
  custom?: boolean;
}

export const TableColGroup = forwardRef<HTMLTableColElement, TTableColGroup>(
  (
    {
      className,
      children,
      custom,
      ...props
    },
    ref,
  ) => {
    const classes = clsx(
      'sui--table-colgroup',
      !custom && 'table-colgroup',
      className,
    );

    return (
      <colgroup ref={ref} className={classes} {...props}>
        {children}
      </colgroup>
    );
  },
);

TableColGroup.displayName = 'TableColGroup';

export default TableColGroup;
