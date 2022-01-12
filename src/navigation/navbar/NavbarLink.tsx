import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { useNav } from './NavContext';
import { TabSet, TabItemProps } from '../..';

export interface NavbarLinkProps extends TabItemProps {}

export const NavbarLink = forwardRef<HTMLDivElement, NavbarLinkProps>(
  ({ children, className, ...props }, ref) => {
    const nav = useNav();
    const classes = classNames(
      'sui--navbar-link',
      { 'text-blue-500': props.active },
      nav?.dark && 'p-2 cursor-pointer',
      nav?.dark &&
        !props.active &&
        'text-gray-300 hover:text-white active:text-white focus:text-white',
      className
    );

    const custom = !!nav?.dark;

    return (
      <TabSet.Item ref={ref} className={classes} custom={custom} {...props}>
        {children}
      </TabSet.Item>
    );
  }
);

NavbarLink.displayName = 'NavbarLink';

export default NavbarLink;
