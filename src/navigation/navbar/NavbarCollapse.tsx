import React, { useState, forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import { useNav } from './NavContext';

export interface NavbarCollapseProps {
  children?: ReactNode;
  className?: string;
}

export const NavbarCollapse = forwardRef<HTMLDivElement, NavbarCollapseProps>(
  ({ children, className, ...props }, ref) => {
    const [isCollapsing, setIsCollapsing] = useState(false)
    const nav = useNav();

    const classes = classNames(
      'sui--navbar-collapse',
      'basis-full grow items-center',
      { 'transition duration-300 ease': isCollapsing },
      className
    )

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

NavbarCollapse.displayName = 'NavbarCollapse';

export default NavbarCollapse;
