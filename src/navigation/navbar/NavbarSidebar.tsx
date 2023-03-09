import React, { forwardRef } from 'react';
import { Drawer, TDrawer } from '../../';
import { useNav } from './NavContext';
import clsx from 'clsx';

export type TNavbarSidebar = TDrawer & {}

export type NavBarSidebarElement = {
  toggle?: () => void;
};

export const NavbarSidebar = forwardRef<NavBarSidebarElement, TNavbarSidebar>(
  ({ children, className, direction, custom, full, ...props }, ref) => {
    const nav = useNav();

    const classes = clsx('sui--navbar-sidebar', className);

    return (
      <Drawer ref={ref} className={classes} {...nav} {...props}>
        {children}
      </Drawer>
    );
  }
);

NavbarSidebar.displayName = 'NavbarSidebar';

export default NavbarSidebar;
