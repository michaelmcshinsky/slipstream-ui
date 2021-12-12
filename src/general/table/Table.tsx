import React, { ReactNode, forwardRef } from 'react';
import classNames from 'classnames';
import TableHead, { TableHeadProps } from './TableHead';
import TableHeader, { TableHeaderProps } from './TableHeader';
import TableBody, { TableBodyProps } from './TableBody';
import TableRow, { TableRowProps } from './TableRow';
import TableCell, { TableCellProps } from './TableCell';

export interface TableProps {
  className?: string;
  children: ReactNode;
  tag?: any;
  align?: string;
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
  striped?: boolean | 'odd' | 'even';
  hover?: boolean | 'row' | 'cell';
  borderless?: boolean;
  custom?: boolean;
}

interface TableComponent
  extends React.ForwardRefExoticComponent<
    TableProps & React.RefAttributes<HTMLDivElement>
  > {
  Head: React.ForwardRefExoticComponent<
    TableHeadProps & React.RefAttributes<HTMLElement>
  >;
  Header: React.ForwardRefExoticComponent<
    TableHeaderProps & React.RefAttributes<HTMLElement>
  >;
  Body: React.ForwardRefExoticComponent<
    TableBodyProps & React.RefAttributes<HTMLElement>
  >;
  Row: React.ForwardRefExoticComponent<
    TableRowProps & React.RefAttributes<HTMLElement>
  >;
  Cell: React.ForwardRefExoticComponent<
    TableCellProps & React.RefAttributes<HTMLElement>
  >;
}

export const Table = forwardRef<HTMLElement, TableProps>(
  (
    {
      className,
      children,
      tag: Tag,
      align,
      bordered,
      striped,
      size,
      hover,
      borderless,
      custom,
      ...props
    },
    ref
  ) => {
    const renderedChildren = React.Children.toArray(children)
      .filter(Boolean)
      .map((child: any) => {
        if (child?.type?.displayName?.includes?.('TableBody')) {
          return React.cloneElement(child, {
            size,
            striped,
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
      'sui--table table',
      'w-full border-collapse table-auto',
      !custom && bordered && 'border border-gray-200',
      !custom && (align ? `align-${align}` : 'align-top'),
      className
    );

    return (
      <Tag ref={ref} className={classes} {...props}>
        {renderedChildren}
      </Tag>
    );
  }
) as TableComponent;

Table.Head = TableHead;
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;

Table.displayName = 'Table';
Table.defaultProps = {
  tag: 'table',
  align: 'top',
  size: 'lg',
};

export default Table;
