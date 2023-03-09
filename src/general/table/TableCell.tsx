import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TTableCell = {
  className?: string;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean | 'row' | 'cell';
  active?: boolean;
  borderless?: boolean;
  custom?: boolean;
};

export const TableCell = forwardRef<HTMLTableCellElement, TTableCell>(
  (
    { className, children, size, hover, active, borderless, custom, ...props },
    ref
  ) => {
    const classes = clsx(
      'sui--table-td',
      'table-cell',
      !custom && [
        !borderless && 'border-b border-gray-200',
        size === 'sm' && 'p-2 text-xs',
        (size === 'md' || !size) && 'p-3 text-sm',
        size === 'lg' && 'p-4 text-base',
        active && 'active bg-gray-200',
        hover &&
          hover !== 'row' &&
          'hover:bg-gray-200 active:bg-gray-200 focus:bg-gray-200',
      ],
      className
    );

    return (
      <td ref={ref} className={classes} {...props}>
        {children}
      </td>
    );
  }
);

TableCell.displayName = 'TableCell';
TableCell.defaultProps = {
  size: 'md',
};

export default TableCell;
