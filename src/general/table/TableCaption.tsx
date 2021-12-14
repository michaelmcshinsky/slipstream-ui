import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface TableCaptionProps {
  className?: string;
  children?: ReactNode;
  custom?: boolean;
}

export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  (
    {
      className,
      children,
      custom,
      ...props
    },
    ref
  ) => {
    const classes = classNames(
      'sui--table-caption',
      !custom && 'table-caption',
      className
    );

    return (
      <caption ref={ref} className={classes} {...props}>
        {children}
      </caption>
    );
  }
);

export default TableCaption;
