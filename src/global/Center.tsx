import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface CenterProps {
  children?: ReactNode;
  className?: string;
}

export const Center = forwardRef<HTMLDivElement, CenterProps>(
  ({ children, className, ...props }, ref) => {
    const classes = classNames('sui--center flex items-center justify-center', className);

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);
