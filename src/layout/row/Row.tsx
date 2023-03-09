import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TRow = {
  children?: ReactNode;
  className?: string;
}

export const Row = forwardRef<HTMLDivElement, TRow>(
  ({ children, className, ...props }, ref) => {
    const classes = clsx('sui--row flex flex-wrap -mx-2', className);

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

Row.displayName = 'Row';

export default Row;