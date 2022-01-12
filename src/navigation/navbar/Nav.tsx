import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import { NavProvider } from './';
import { Navbar, NavbarProps } from './Navbar';
import { NavbarBrand, NavbarBrandProps } from './NavbarBrand';
import { NavbarCollapse, NavbarCollapseProps } from './NavbarCollapse';
import { NavbarDivider, NavbarDividerProps } from './NavbarDivider';
import { NavbarList, NavbarListProps } from './NavbarList';
import { NavbarLink, NavbarLinkProps } from './NavbarLink';
import { NavbarMenu, NavbarMenuProps } from './NavbarMenu';
import { NavbarSidebar, NavbarSidebarProps } from './NavbarSidebar';
import { NavbarText, NavbarTextProps } from './NavbarText';
import { NavbarToggler, NavbarTogglerProps } from './NavbarToggler';

export interface NavProps {
  children?: ReactNode;
  className?: string;
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
  custom?: boolean;
  dark?: boolean;
}

interface NavbarComponent
  extends React.ForwardRefExoticComponent<
    NavProps & React.RefAttributes<HTMLElement>
  > {
  Bar: React.ForwardRefExoticComponent<
    NavbarProps & React.RefAttributes<HTMLDivElement>
  >;
  Brand: React.ForwardRefExoticComponent<
    NavbarBrandProps & React.RefAttributes<HTMLDivElement>
  >;
  Collapse: React.ForwardRefExoticComponent<
    NavbarCollapseProps & React.RefAttributes<HTMLDivElement>
  >;
  Divider: React.ForwardRefExoticComponent<
    NavbarDividerProps & React.RefAttributes<HTMLHRElement>
  >;
  List: React.ForwardRefExoticComponent<
    NavbarListProps & React.RefAttributes<HTMLDivElement>
  >;
  Link: React.ForwardRefExoticComponent<
    NavbarLinkProps & React.RefAttributes<HTMLDivElement>
  >;
  Menu: React.ForwardRefExoticComponent<
    NavbarMenuProps & React.RefAttributes<HTMLDivElement>
  >;
  Sidebar: React.ForwardRefExoticComponent<
    NavbarSidebarProps & React.RefAttributes<HTMLDivElement>
  >;
  Text: React.ForwardRefExoticComponent<
    NavbarTextProps & React.RefAttributes<HTMLDivElement>
  >;
  Toggler: React.ForwardRefExoticComponent<
    NavbarTogglerProps & React.RefAttributes<HTMLDivElement>
  >;
}

export const Nav = forwardRef<HTMLElement, NavProps>(
  ({ children, className, mobile, size, custom, dark, ...props }, ref) => {
    const classes = classNames(
      'sui--nav',
      'relative',
      !custom && [
        !dark ? 'bg-white' : 'bg-gray-900 text-gray-100',
        dark ? 'text-gray-300' : 'text-gray-500',
      ],
      className
    );

    return (
      <NavProvider mobile={mobile} size={size} custom={custom} dark={dark}>
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
