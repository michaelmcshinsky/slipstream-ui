import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface TableFooterProps {
  className?: string;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  striped?: boolean | 'odd' | 'even';
  hover?: boolean | 'row' | 'cell';
  borderless?: boolean;
  custom?: boolean;
}

export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
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

    const classes = classNames(
      'sui--table-tfoot',
      !custom && 'table-row-group dark:text-gray-300',
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
