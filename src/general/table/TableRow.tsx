import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface TableRowProps {
  className?: string;
  children?: ReactNode;
  tag?: any;
  size?: 'sm' | 'md' | 'lg';
  striped?: boolean | 'odd' | 'even';
  hover?: boolean | 'row' | 'cell';
  active?: boolean;
  borderless?: boolean;
  custom?: boolean;
}

export const TableRow = forwardRef<HTMLElement, TableRowProps>(
  (
    {
      className,
      children,
      tag: Tag,
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
            size,
            hover,
            borderless,
            custom,
          });
        }
        if (child?.type?.displayName?.includes?.('Table')) {
          return React.cloneElement(child, {
            size,
            borderless,
            custom,
          });
        }
        return child;
      });

    const classes = classNames(
      'sui--table-tr',
      'table-row',
      !custom && [
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
      <Tag ref={ref} className={classes} {...props}>
        {renderedChildren}
      </Tag>
    );
  }
);

TableRow.defaultProps = {
  tag: 'tr',
  size: 'lg',
};

export default TableRow;
