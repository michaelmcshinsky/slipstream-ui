import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TCenter = {
  children?: ReactNode;
  className?: string;
}

export const Center = forwardRef<HTMLDivElement, TCenter>(
  ({ children, className, ...props }, ref) => {
    const classes = clsx('sui--center flex items-center justify-center', className);

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

Center.displayName = 'Center';

export default Center;