import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TTableRow = {
  className?: string;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  striped?: boolean | 'odd' | 'even';
  hover?: boolean | 'row' | 'cell';
  active?: boolean;
  borderless?: boolean;
  custom?: boolean;
};

export const TableRow = forwardRef<HTMLTableRowElement, TTableRow>(
  (
    {
      className,
      children,
      size,
      striped,
      hover,
      active,
      borderless,
      custom,
      ...props
    },
    ref
  ) => {
    const renderedChildren = React.Children.toArray(children)
      .filter(Boolean)
      .map((child: any) => {
        if (child?.type?.displayName?.includes?.('TableCell')) {
          return React.cloneElement(child, {
            active,
            borderless,
            custom,
            hover,
            size,
          });
        }
        if (child?.type?.displayName?.includes?.('Table')) {
          return React.cloneElement(child, {
            borderless,
            custom,
            size,
          });
        }
        return child;
      });

    const classes = clsx(
      'sui--table-tr',
      !custom && [
        'table-row',
        striped && striped !== 'odd' && 'even:bg-gray-100',
        striped && striped === 'odd' && 'odd:bg-gray-100',
        active && 'active bg-gray-200',
        hover &&
          hover !== 'cell' &&
          'hover:bg-gray-200 active:bg-gray-200 focus:bg-gray-200',
      ],
      className
    );

    return (
      <tr ref={ref} className={classes} {...props}>
        {renderedChildren}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';
TableRow.defaultProps = {
  size: 'md',
};

export default TableRow;
