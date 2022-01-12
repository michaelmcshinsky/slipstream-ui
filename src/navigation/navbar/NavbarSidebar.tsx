import React, { forwardRef } from 'react';
import { OffCanvasMenu, OffCanvasMenuProps } from '../off-canvas-menu';
import { useNav } from './NavContext';
import classNames from 'classnames';

export interface NavbarSidebarProps extends OffCanvasMenuProps {}

export type NavBarSidebarElement = {
  toggle?: () => void;
};

export const NavbarSidebar = forwardRef<NavBarSidebarElement, NavbarSidebarProps>(
  ({ children, className, direction, custom, full, ...props }, ref) => {
    const nav = useNav();

    const classes = classNames('sui--navbar-sidebar', className);

    return (
      <OffCanvasMenu ref={ref} className={classes} {...nav} {...props}>
        {children}
      </OffCanvasMenu>
    );
  }
);

NavbarSidebar.displayName = 'NavbarSidebar';

export default NavbarSidebar;
