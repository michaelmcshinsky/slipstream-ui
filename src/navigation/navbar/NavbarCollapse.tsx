import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface NavbarCollapseProps {
  children?: ReactNode;
  className?: string;
}

export const NavbarCollapse = forwardRef<HTMLDivElement, NavbarCollapseProps>(
  ({ children, className, ...props }, ref) => {

    const classes = classNames(
      'sui--navbar-collapse',
      'basis-full grow items-center',
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
