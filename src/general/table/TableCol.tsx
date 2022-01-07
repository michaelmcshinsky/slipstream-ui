import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface TableColProps {
  className?: string;
  children?: ReactNode;
  span?: number;
  custom?: boolean;
}

export const TableCol = forwardRef<HTMLTableColElement, TableColProps>(
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
      'sui--table-colgroup_col',
      className,
    );

    return (
      <col ref={ref} className={classes} {...props} />
    );
  },
);

TableCol.displayName = 'TableCol';

export default TableCol;
