import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface TableHeadProps {
  className?: string;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  borderless?: boolean;
  custom?: boolean;
}

export const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  (
    { className, children, size, borderless, custom, ...props },
    ref,
  ) => {
    const renderedChildren = React.Children.toArray(children)
      .filter(Boolean)
      .map((child: any) => {
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
      'sui--table-thead',
      !custom && 'table-head-group dark:text-gray-300',
      className,
    );

    return (
      <thead ref={ref} className={classes} {...props}>
        {renderedChildren}
      </thead>
    );
  },
);

TableHead.displayName = 'TableHead';
TableHead.defaultProps = {
  size: 'md',
};

export default TableHead;
