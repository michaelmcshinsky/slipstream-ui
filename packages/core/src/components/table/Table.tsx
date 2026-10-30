import * as React from 'react';
import { cn } from '../../utils/cn';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

/** Semantic table wrapper with consistent borders and striping. */
const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  )
);
Table.displayName = 'Table';

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

/** Groups the header row(s). */
const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
  )
);
TableHeader.displayName = 'TableHeader';

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

/** Groups the body row(s). */
const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  )
);
TableBody.displayName = 'TableBody';

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

/** Groups the footer row(s) for summary content. */
const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn('border-t border-border bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  )
);
TableFooter.displayName = 'TableFooter';

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

/** A table row. */
const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

/** A header cell. */
const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      scope="col"
      className={cn(
        'h-10 px-3 text-left align-middle text-xs font-medium uppercase tracking-wider text-muted-foreground',
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = 'TableHead';

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

/** A data cell. */
const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn('px-3 py-2 align-middle', className)} {...props} />
  )
);
TableCell.displayName = 'TableCell';

export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

/** Accessible caption describing the table's contents. */
const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn('mt-3 text-xs text-muted-foreground', className)} {...props} />
  )
);
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
