import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TNavbarCollapse = {
  children?: ReactNode;
  className?: string;
};

export const NavbarCollapse = forwardRef<HTMLDivElement, TNavbarCollapse>(
  ({ children, className, ...props }, ref) => {
    const classes = clsx(
      'sui--navbar-collapse',
      'basis-full grow items-center',
      className
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

NavbarCollapse.displayName = 'NavbarCollapse';

export default NavbarCollapse;
