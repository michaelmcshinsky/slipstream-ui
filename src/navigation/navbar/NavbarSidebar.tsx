import React, { forwardRef } from 'react';
import { OffCanvas, OffCanvasProps } from '../../';
import { useNav } from './NavContext';
import classNames from 'classnames';

export interface NavbarSidebarProps extends OffCanvasProps {}

export type NavBarSidebarElement = {
  toggle?: () => void;
};

export const NavbarSidebar = forwardRef<NavBarSidebarElement, NavbarSidebarProps>(
  ({ children, className, direction, custom, full, ...props }, ref) => {
    const nav = useNav();

    const classes = classNames('sui--navbar-sidebar', className);

    return (
      <OffCanvas ref={ref} className={classes} {...nav} {...props}>
        {children}
      </OffCanvas>
    );
  }
);

NavbarSidebar.displayName = 'NavbarSidebar';

export default NavbarSidebar;
