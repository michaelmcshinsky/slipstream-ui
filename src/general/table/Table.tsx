import React, { ReactNode, forwardRef } from 'react';
import classNames from 'classnames';
import TableHead, { TableHeadProps } from './TableHead';
import TableHeader, { TableHeaderProps } from './TableHeader';
import TableBody, { TableBodyProps } from './TableBody';
import TableRow, { TableRowProps } from './TableRow';
import TableCaption, { TableCaptionProps } from './TableCaption';
import TableCell, { TableCellProps } from './TableCell';
import TableCol, { TableColProps } from './TableCol';
import TableColGroup, { TableColGroupProps } from './TableColGroup';
import TableFooter, { TableFooterProps } from './TableFooter';

export interface TableProps {
  className?: string;
  children: ReactNode;
  tag?: any;
  align?: string;
  size?: 'sm' | 'md' | 'lg';
  border?: boolean;
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
  Footer: React.ForwardRefExoticComponent<
    TableFooterProps & React.RefAttributes<HTMLElement>
  >;
  Caption: React.ForwardRefExoticComponent<
    TableCaptionProps & React.RefAttributes<HTMLTableCaptionElement>
  >;
  Col: React.ForwardRefExoticComponent<
    TableColProps & React.RefAttributes<HTMLTableColElement>
  >;
  ColGroup: React.ForwardRefExoticComponent<
    TableColGroupProps & React.RefAttributes<HTMLTableColElement>
  >;
}

export const Table = forwardRef<HTMLElement, TableProps>(
  (
    {
      className,
      children,
      tag: Tag,
      align,
      border,
      striped,
      size,
      hover,
      borderless,
      custom,
      ...props
    },
    ref,
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
      !custom && border && 'border border-gray-200',
      !custom && (align ? `align-${align}` : 'align-top'),
      className,
    );

    return (
      <Tag ref={ref} className={classes} {...props}>
        {renderedChildren}
      </Tag>
    );
  },
) as TableComponent;

Table.Body = TableBody;
Table.Head = TableHead;
Table.Header = TableHeader;
Table.Caption = TableCaption;
Table.Cell = TableCell;
Table.Col = TableCol;
Table.ColGroup = TableColGroup;
Table.Footer = TableFooter;
Table.Row = TableRow;

Table.displayName = 'Table';
Table.defaultProps = {
  tag: 'table',
  align: 'top',
  size: 'md',
};

export default Table;
