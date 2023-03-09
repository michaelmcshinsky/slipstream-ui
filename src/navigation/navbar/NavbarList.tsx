import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { TabSet, TTabSet } from '../../';

export type TNavbarList = TTabSet & {
  direction?: 'left' | 'right';
  left?: boolean;
  right?: boolean;
}

export const NavbarList = forwardRef<HTMLDivElement, TNavbarList>(
  ({ children, className, direction, left, right, ...props }, ref) => {
    const classes = clsx(
      'sui--navbar-list',
      { 'justify-end': direction === 'right' || right },
      { 'justify-start': (direction === 'left' || left) && !right },
      { 'text-right': (direction === 'right' || right) && props.vertical },
      className
    );

    return (
      <TabSet ref={ref} className={classes} {...props}>
        {children}
      </TabSet>
    );
  }
);

NavbarList.displayName = 'NavbarList';

export default NavbarList;
