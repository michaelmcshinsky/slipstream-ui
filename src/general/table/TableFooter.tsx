import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TTableFooter = {
  className?: string;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  striped?: boolean | 'odd' | 'even';
  hover?: boolean | 'row' | 'cell';
  borderless?: boolean;
  custom?: boolean;
}

export const TableFooter = forwardRef<HTMLTableSectionElement, TTableFooter>(
  (
    {
      className,
      children,
      size,
      striped,
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
        if (child?.type?.displayName?.includes?.('TableRow')) {
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
      'sui--table-tfoot',
      !custom && 'table-row-group',
      className,
    );

    return (
      <tfoot ref={ref} className={classes} {...props}>
        {renderedChildren}
      </tfoot>
    );
  },
);

TableFooter.displayName = 'TableFooter';
TableFooter.defaultProps = {
  size: 'md',
};

export default TableFooter;
