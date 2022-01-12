import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import { useNav } from './NavContext';

export interface NavbarDividerProps {
  children?: ReactNode;
  className?: string;
}

export const NavbarDivider = forwardRef<HTMLHRElement, NavbarDividerProps>(
  ({ children, className, ...props }, ref) => {
    const nav = useNav();
    const classes = classNames(
      'sui--navbar-divider',
      'my-2',
      nav?.dark ? 'border-gray-500' : 'border-gray-300',
      className
    );

    return <hr ref={ref} className={classes} {...props} />;
  }
);

NavbarDivider.displayName = 'NavbarDivider';

export default NavbarDivider;
