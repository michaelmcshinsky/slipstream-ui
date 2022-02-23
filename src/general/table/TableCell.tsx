import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface TableCellProps {
  className?: string;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean | 'row' | 'cell';
  active?: boolean;
  borderless?: boolean;
  custom?: boolean;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  (
    {
      className,
      children,
      size,
      hover,
      active,
      borderless,
      custom,
      ...props
    },
    ref
  ) => {
    const classes = classNames(
      'sui--table-td',
      'table-cell',
      !custom && [
        !borderless && 'border-b border-gray-200 dark:border-gray-500',
        size === 'sm' && 'p-2 text-xs',
        (size === 'md' || !size) && 'p-3 text-sm',
        size === 'lg' && 'p-4 text-base',
        active && 'active bg-gray-200 dark:text-gray-700',
        hover && 'dark:hover:text-gray-700',
        hover &&
          hover !== 'row' &&
          'hover:bg-gray-200 active:bg-gray-200 focus:bg-gray-200 dark:hover:text-gray-700',
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
