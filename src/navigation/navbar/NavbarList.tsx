import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { TabSet, TabSetProps } from '../../';

export interface NavbarListProps extends TabSetProps {
  direction?: 'left' | 'right';
  left?: boolean;
  right?: boolean;
}

export const NavbarList = forwardRef<HTMLDivElement, NavbarListProps>(
  ({ children, className, direction, left, right, ...props }, ref) => {
    const classes = classNames(
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
