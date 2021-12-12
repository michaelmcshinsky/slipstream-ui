import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface TableBodyProps {
  className?: string;
  children?: ReactNode;
  tag?: any;
  size?: 'sm' | 'md' | 'lg';
  striped?: boolean | 'odd' | 'even';
  hover?: boolean | 'row' | 'cell';
  borderless?: boolean;
  custom?: boolean;
}

export const TableBody = forwardRef<HTMLElement, TableBodyProps>(
  (
    {
      className,
      children,
      tag: Tag,
      size,
      striped,
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
      'sui--table-tbody',
      'table-row-group',
      className
    );

    return (
      <Tag ref={ref} className={classes} {...props}>
        {renderedChildren}
      </Tag>
    );
  }
);

TableBody.defaultProps = {
  tag: 'tbody',
  size: 'lg',
};

export default TableBody;
