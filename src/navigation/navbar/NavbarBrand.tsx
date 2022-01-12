import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface NavbarBrandProps {
  children?: ReactNode;
  className?: string;
}

export const NavbarBrand = forwardRef<HTMLDivElement, NavbarBrandProps>(
  ({ children, className, ...props }, ref) => {
    const classes = classNames('sui--navbar-brand', 'flex-shrink-0', className);

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

NavbarBrand.displayName = 'NavbarBrand';

export default NavbarBrand;
