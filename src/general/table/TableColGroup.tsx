import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface TableColGroupProps {
  className?: string;
  children: ReactNode;
  span?: number;
  custom?: boolean;
}

export const TableColGroup = forwardRef<HTMLTableColElement, TableColGroupProps>(
  (
    {
      className,
      children,
      custom,
      ...props
    },
    ref,
  ) => {
    const classes = classNames(
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
