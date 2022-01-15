import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface NavbarDividerProps {
  children?: ReactNode;
  className?: string;
  custom?: boolean;
}

export const NavbarDivider = forwardRef<HTMLHRElement, NavbarDividerProps>(
  ({ children, className, custom, ...props }, ref) => {
    const classes = classNames(
      'sui--navbar-divider',
      { 'my-2 border-gray-300 dark:border-gray-500': !custom },
      className
    );

    return <hr ref={ref} className={classes} {...props} />;
  }
);

NavbarDivider.displayName = 'NavbarDivider';

export default NavbarDivider;
