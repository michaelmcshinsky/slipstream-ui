import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface TableHeadProps {
  className?: string;
  children: ReactNode;
  tag?: any;
  size?: 'sm' | 'md' | 'lg';
  borderless?: boolean;
  custom?: boolean;
}

export const TableHead = forwardRef<HTMLElement, TableHeadProps>(
  (
    { className, children, tag: Tag, size, borderless, custom, ...props },
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
      !custom && 'table-head-group',
      className,
    );

    return (
      <Tag ref={ref} className={classes} {...props}>
        {renderedChildren}
      </Tag>
    );
  },
);

TableHead.displayName = 'TableHead';
TableHead.defaultProps = {
  tag: 'thead',
  size: 'md',
};

export default TableHead;
