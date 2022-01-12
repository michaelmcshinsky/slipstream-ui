import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import { NavbarCollapse, NavbarCollapseProps } from './NavbarCollapse';
import { useNav } from './NavContext';

export interface NavbarMenuProps extends NavbarCollapseProps {
  children?: ReactNode;
  className?: string;
  absolute?: boolean;
}

export const NavbarMenu = forwardRef<HTMLDivElement, NavbarMenuProps>(
  ({ children, className, absolute, ...props }, ref) => {
    const nav = useNav();

    const classes = classNames(
      'sui--navbar-menu',
      'py-2',
      !nav?.custom && [!nav?.dark ? 'bg-white' : 'bg-gray-900'],
      nav?.size && `${nav.size}:hidden`,
      nav?.isOpen ? 'block' : 'hidden',
      { 'absolute w-full': absolute },
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
