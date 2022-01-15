import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface NavbarTextProps {
  children?: ReactNode;
  className?: string;
  custom?: boolean;
  tag?: any;
}

export const NavbarText = forwardRef<HTMLDivElement, NavbarTextProps>(
  ({ children, className, tag: Tag, custom, ...props }, ref) => {
    const classes = classNames(
      'sui--navbar-text',
      'mx-2 p-2',
      { 'dark:hover:text-white dark:active:text-white dark:focus:text-white': !custom },
      className
    );

    return (
      <Tag ref={ref} className={classes} {...props}>
        {children}
      </Tag>
    );
  }
);

NavbarText.displayName = 'NavbarText';
NavbarText.defaultProps = {
  tag: 'div',
};

export default NavbarText;
