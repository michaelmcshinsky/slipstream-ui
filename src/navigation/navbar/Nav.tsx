import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import { NavProvider } from './';
import { Navbar, TNavbar } from './Navbar';
import { NavbarBrand, TNavbarBrand } from './NavbarBrand';
import { NavbarCollapse, TNavbarCollapse } from './NavbarCollapse';
import { NavbarDivider, TNavbarDivider } from './NavbarDivider';
import { NavbarList, TNavbarList } from './NavbarList';
import { NavbarLink, TNavbarLink } from './NavbarLink';
import { NavbarMenu, TNavbarMenu } from './NavbarMenu';
import {
  NavbarSidebar,
  NavBarSidebarElement,
  TNavbarSidebar,
} from './NavbarSidebar';
import { NavbarText, TNavbarText } from './NavbarText';
import { NavbarToggler, TNavbarToggler } from './NavbarToggler';

export type TNav = {
  children?: ReactNode;
  className?: string;
  custom?: boolean;
  disableScroll?: boolean;
  mobile?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  size?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl';
};

type NavbarComponent = React.ForwardRefExoticComponent<
  TNav & React.RefAttributes<HTMLElement>
> & {
  Bar: React.ForwardRefExoticComponent<
    TNavbar & React.RefAttributes<HTMLDivElement>
  >;
  Brand: React.ForwardRefExoticComponent<
    TNavbarBrand & React.RefAttributes<HTMLDivElement>
  >;
  Collapse: React.ForwardRefExoticComponent<
    TNavbarCollapse & React.RefAttributes<HTMLDivElement>
  >;
  Divider: React.ForwardRefExoticComponent<
    TNavbarDivider & React.RefAttributes<HTMLHRElement>
  >;
  List: React.ForwardRefExoticComponent<
    TNavbarList & React.RefAttributes<HTMLDivElement>
  >;
  Link: React.ForwardRefExoticComponent<
    TNavbarLink & React.RefAttributes<HTMLDivElement>
  >;
  Menu: React.ForwardRefExoticComponent<
    TNavbarMenu & React.RefAttributes<HTMLDivElement>
  >;
  Sidebar: React.ForwardRefExoticComponent<
    TNavbarSidebar & React.RefAttributes<NavBarSidebarElement>
  >;
  Text: React.ForwardRefExoticComponent<
    TNavbarText & React.RefAttributes<HTMLDivElement>
  >;
  Toggler: React.ForwardRefExoticComponent<
    TNavbarToggler & React.RefAttributes<HTMLDivElement>
  >;
};

export const Nav = forwardRef<HTMLElement, TNav>(
  (
    { children, className, custom, disableScroll, mobile, size, ...props },
    ref
  ) => {
    const classes = clsx(
      'sui--nav',
      'relative',
      !custom && ['bg-white text-gray-500'],
      className
    );

    return (
      <NavProvider
        custom={custom}
        disableScroll={disableScroll}
        mobile={mobile}
        size={size}
      >
        <nav ref={ref} className={classes} {...props}>
          {children}
        </nav>
      </NavProvider>
    );
  }
) as NavbarComponent;

Nav.displayName = 'Nav';
Nav.Bar = Navbar;
Nav.Brand = NavbarBrand;
Nav.Collapse = NavbarCollapse;
Nav.Divider = NavbarDivider;
Nav.List = NavbarList;
Nav.Link = NavbarLink;
Nav.Menu = NavbarMenu;
Nav.Sidebar = NavbarSidebar;
Nav.Text = NavbarText;
Nav.Toggler = NavbarToggler;

Nav.defaultProps = {
  size: 'md',
};

export default Nav;
