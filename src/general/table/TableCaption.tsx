import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TTableCaption = {
  className?: string;
  children?: ReactNode;
  custom?: boolean;
}

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  TTableCaption
>(({ className, children, custom, ...props }, ref) => {
  const classes = clsx(
    'sui--table-caption',
    !custom && 'table-caption',
    className,
  );

  return (
    <caption ref={ref} className={classes} {...props}>
      {children}
    </caption>
  );
});

TableCaption.displayName = 'TableCaption';

export default TableCaption;
