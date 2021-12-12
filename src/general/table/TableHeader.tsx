import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface TableHeaderProps {
  className?: string;
  children?: ReactNode;
  tag?: any;
  size?: 'sm' | 'md' | 'lg';
  borderless?: boolean;
  custom?: boolean;
}

export const TableHeader = forwardRef<HTMLElement, TableHeaderProps>(
  (
    { className, children, tag: Tag, size, borderless, custom, ...props },
    ref
  ) => {
    const classes = classNames(
      'sui--table-th',
      'table-cell',
      'text-left',
      !custom && [
        !borderless && 'border-b border-gray-500',
        size === 'sm' && 'p-2 text-xs',
        (size === 'md' || !size) && 'p-3 text-sm',
        size === 'lg' && 'p-4 text-base',
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

TableHeader.defaultProps = {
  tag: 'th',
  size: 'lg',
};

export default TableHeader;
