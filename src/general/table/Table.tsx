import React, { ReactNode, forwardRef } from 'react';
import clsx from 'clsx';
import TableHead, { TTableHead } from './TableHead';
import TableHeader, { TTableHeader } from './TableHeader';
import TableBody, { TTableBody } from './TableBody';
import TableRow, { TTableRow } from './TableRow';
import TableCaption, { TTableCaption } from './TableCaption';
import TableCell, { TTableCell } from './TableCell';
import TableCol, { TTableCol } from './TableCol';
import TableColGroup, { TTableColGroup } from './TableColGroup';
import TableFooter, { TTableFooter } from './TableFooter';

export type TTable = {
  className?: string;
  children?: ReactNode;
  tag?: any;
  align?: string;
  size?: 'sm' | 'md' | 'lg';
  border?: boolean;
  striped?: boolean | 'odd' | 'even';
  hover?: boolean | 'row' | 'cell';
  borderless?: boolean;
  custom?: boolean;
};

type TableComponent = React.ForwardRefExoticComponent<
  TTable & React.RefAttributes<HTMLDivElement>
> & {
  Head: React.ForwardRefExoticComponent<
    TTableHead & React.RefAttributes<HTMLTableSectionElement>
  >;
  Header: React.ForwardRefExoticComponent<
    TTableHeader & React.RefAttributes<HTMLTableCellElement>
  >;
  Body: React.ForwardRefExoticComponent<
    TTableBody & React.RefAttributes<HTMLTableSectionElement>
  >;
  Row: React.ForwardRefExoticComponent<
    TTableRow & React.RefAttributes<HTMLTableRowElement>
  >;
  Cell: React.ForwardRefExoticComponent<
    TTableCell & React.RefAttributes<HTMLTableCellElement>
  >;
  Footer: React.ForwardRefExoticComponent<
    TTableFooter & React.RefAttributes<HTMLTableSectionElement>
  >;
  Caption: React.ForwardRefExoticComponent<
    TTableCaption & React.RefAttributes<HTMLTableCaptionElement>
  >;
  Col: React.ForwardRefExoticComponent<
    TTableCol & React.RefAttributes<HTMLTableColElement>
  >;
  ColGroup: React.ForwardRefExoticComponent<
    TTableColGroup & React.RefAttributes<HTMLTableColElement>
  >;
};

export const Table = forwardRef<HTMLElement, TTable>(
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

    const classes = clsx(
      'sui--table table',
      'w-full border-collapse table-auto',
      !custom && border && 'border border-gray-200',
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
