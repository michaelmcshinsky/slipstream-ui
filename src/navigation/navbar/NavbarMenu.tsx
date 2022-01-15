import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import { NavbarCollapse, NavbarCollapseProps } from './NavbarCollapse';
import { useNav } from './NavContext';

export interface NavbarMenuProps extends NavbarCollapseProps {
  children?: ReactNode;
  className?: string;
  offCanvas?: boolean;
}

export const NavbarMenu = forwardRef<HTMLDivElement, NavbarMenuProps>(
  ({ children, className, offCanvas, ...props }, ref) => {
    const nav = useNav();

    const classes = classNames(
      'sui--navbar-menu',
      'py-2',
      !nav?.custom && 'bg-white dark:bg-gray-900 dark:text-gray-300',
      nav?.size && `${nav.size}:hidden`,
      nav?.isOpen ? 'block' : 'hidden',
      { 'absolute w-full': offCanvas },
      className
    );

    const renderedChildren = React.Children.toArray(children)
      .filter(Boolean)
      .map((child: any) => {
        if (child?.type?.displayName?.includes?.('NavbarList')) {
          return React.cloneElement(child, {
            vertical: true,
          });
        }
        return child;
      });

    if (!nav?.isOpen) {
      return null;
    }

    return (
      <NavbarCollapse ref={ref} className={classes} {...props}>
        {renderedChildren}
      </NavbarCollapse>
    );
  }
);

NavbarMenu.displayName = 'NavbarMenu';

export default NavbarMenu;
