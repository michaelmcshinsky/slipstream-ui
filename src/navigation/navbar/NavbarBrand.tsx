import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TNavbarBrand = {
  children?: ReactNode;
  className?: string;
}

export const NavbarBrand = forwardRef<HTMLDivElement, TNavbarBrand>(
  ({ children, className, ...props }, ref) => {
    const classes = clsx('sui--navbar-brand', 'flex-shrink-0', className);

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

NavbarBrand.displayName = 'NavbarBrand';

export default NavbarBrand;
