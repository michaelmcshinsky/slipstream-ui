import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface RowProps {
  children?: ReactNode;
  className?: string;
}

export const Row = forwardRef<HTMLDivElement, RowProps>(
  ({ children, className, ...props }, ref) => {
    const classes = classNames('sui--row flex flex-wrap -mx-2', className);

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);
