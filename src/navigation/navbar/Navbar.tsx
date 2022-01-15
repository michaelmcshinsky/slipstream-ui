import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import { useNav } from './NavContext';
import { Container } from '../../';

export interface NavbarProps {
  children?: ReactNode;
  className?: string;
}

export const Navbar = forwardRef<HTMLDivElement, NavbarProps>(
  ({ children, className, ...props }, ref) => {
    const nav = useNav();
    const classes = classNames(
      'sui--navbar',
      'flex items-center flex-1',
      className
    );

    const renderedChildren = React.Children.toArray(children)
      .filter(Boolean)
      .map((child: any) => {
        if (child?.type?.displayName?.includes?.('NavbarCollapse')) {
          return React.cloneElement(child, {
            className: `hidden ${!!nav?.mobile && `${nav.mobile}:block`} ${
              child.props?.className ?? ''
            }`,
          });
        }
        return child;
      });

    return (
      <Container ref={ref} className={classes} {...props}>
        {renderedChildren}
      </Container>
    );
  }
);

Navbar.displayName = 'Navbar';

export default Navbar;
