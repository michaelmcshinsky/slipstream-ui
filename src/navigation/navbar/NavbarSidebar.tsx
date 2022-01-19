import React, { forwardRef } from 'react';
import { Drawer, DrawerProps } from '../../';
import { useNav } from './NavContext';
import classNames from 'classnames';

export interface NavbarSidebarProps extends DrawerProps {}

export type NavBarSidebarElement = {
  toggle?: () => void;
};

export const NavbarSidebar = forwardRef<NavBarSidebarElement, NavbarSidebarProps>(
  ({ children, className, direction, custom, full, ...props }, ref) => {
    const nav = useNav();

    const classes = classNames('sui--navbar-sidebar', className);

    return (
      <Drawer ref={ref} className={classes} {...nav} {...props}>
        {children}
      </Drawer>
    );
  }
);

NavbarSidebar.displayName = 'NavbarSidebar';

export default NavbarSidebar;
