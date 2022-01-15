import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { TabSet, TabItemProps } from '../..';

export interface NavbarLinkProps extends TabItemProps {
  custom?: boolean;
}

export const NavbarLink = forwardRef<HTMLDivElement, NavbarLinkProps>(
  ({ children, className, custom, ...props }, ref) => {
    const classes = classNames(
      'sui--navbar-link',
      { 'text-blue-500': props.active },
      'p-2 cursor-pointer',
      {
        'dark:text-gray-300 dark:hover:text-white dark:active:text-white dark:focus:text-white':
          !props.active && !custom,
      },
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
