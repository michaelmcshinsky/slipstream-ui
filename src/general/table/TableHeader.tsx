import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TTableHeader = {
  className?: string;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  borderless?: boolean;
  custom?: boolean;
}

export const TableHeader = forwardRef<HTMLTableCellElement, TTableHeader>(
  (
    { className, children, size, borderless, custom, ...props },
    ref,
  ) => {
    const classes = clsx(
      'sui--table-th',
      !custom && [
        'table-cell text-left',
        !borderless && 'border-b border-gray-500',
        size === 'sm' && 'p-2 text-xs',
        (size === 'md' || !size) && 'p-3 text-sm',
        size === 'lg' && 'p-4 text-base',
      ],
      className,
    );

    return (
      <th ref={ref} className={classes} {...props}>
        {children}
      </th>
    );
  },
);

TableHeader.displayName = 'TableHeader';
TableHeader.defaultProps = {
  size: 'md',
};

export default TableHeader;
