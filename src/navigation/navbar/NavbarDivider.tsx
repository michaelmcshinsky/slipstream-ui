import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TNavbarDivider = {
  children?: ReactNode;
  className?: string;
  custom?: boolean;
}

export const NavbarDivider = forwardRef<HTMLHRElement, TNavbarDivider>(
  ({ children, className, custom, ...props }, ref) => {
    const classes = clsx(
      'sui--navbar-divider',
      { 'my-2 border-gray-300': !custom },
      className
    );

    return <hr ref={ref} className={classes} {...props} />;
  }
);

NavbarDivider.displayName = 'NavbarDivider';

export default NavbarDivider;
