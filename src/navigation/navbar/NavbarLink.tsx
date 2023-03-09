import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { TabSet, TTabItem } from '../..';

export type TNavbarLink = TTabItem & {
  custom?: boolean;
}

export const NavbarLink = forwardRef<HTMLDivElement, TNavbarLink>(
  ({ children, className, custom, ...props }, ref) => {
    const classes = clsx(
      'sui--navbar-link',
      { 'text-blue-500': props.active },
      'p-2 cursor-pointer',
      className
    );

    return (
      <TabSet.Item ref={ref} className={classes} {...props}>
        {children}
      </TabSet.Item>
    );
  }
);

NavbarLink.displayName = 'NavbarLink';

export default NavbarLink;
