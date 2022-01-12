import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import { useNav } from './NavContext';

export interface NavbarTextProps {
  children?: ReactNode;
  className?: string;
  tag?: any;
}

export const NavbarText = forwardRef<HTMLDivElement, NavbarTextProps>(
  ({ children, className, tag: Tag, ...props }, ref) => {
    const nav = useNav();
    const classes = classNames(
      'sui--navbar-text',
      'p-2',
      { 'hover:text-white active:text-white focus:text-white': nav?.dark },
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
