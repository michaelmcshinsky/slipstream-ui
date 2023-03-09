import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TNavbarText = {
  children?: ReactNode;
  className?: string;
  custom?: boolean;
  tag?: any;
};

export const NavbarText = forwardRef<HTMLDivElement, TNavbarText>(
  ({ children, className, tag: Tag, custom, ...props }, ref) => {
    const classes = clsx('sui--navbar-text', 'mx-2 p-2', className);

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
