import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface TableCellProps {
  className?: string;
  children?: ReactNode;
  tag?: any;
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean | 'row' | 'cell';
  active?: boolean;
  borderless?: boolean;
  custom?: boolean;
}

export const TableCell = forwardRef<HTMLElement, TableCellProps>(
  (
    {
      className,
      children,
      tag: Tag,
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
      <Tag ref={ref} className={classes} {...props}>
        {children}
      </Tag>
    );
  }
);

TableCell.defaultProps = {
  tag: 'td',
  size: 'lg',
};

export default TableCell;
