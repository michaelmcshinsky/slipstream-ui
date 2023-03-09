import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import { useNav } from './NavContext';

export type TNavbarToggler = {
  className?: string;
  custom?: boolean;
  iconOpen?: ReactNode;
  iconClose?: ReactNode;
  sr?: string;
}

export const NavbarToggler = forwardRef<HTMLDivElement, TNavbarToggler>(
  ({ className, custom, iconOpen, iconClose, sr, ...props }, ref) => {
    const nav = useNav();

    function _toggle() {
      if (!!nav?.toggle) {
        nav.toggle();
      }
    }

    function _renderIcon() {
      if (nav?.isOpen) {
        if (iconOpen) {
          return iconOpen;
        } else {
          return (
            <svg
              className="block w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          );
        }
      } else if (iconClose) {
        return iconClose;
      }
      return (
        <svg
          className="block w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      );
    }

    const classes = clsx(
      'sui--navbar-toggler',
      'flex',
      !!nav?.mobile ? `${nav.mobile}:hidden` : 'md:hidden',
      className
    );

    const buttonClasses = clsx(
      'inline-flex items-center justify-center p-2 rounded-md',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white',
      'transform-all duration-300 ease',
    );

    return (
      <div ref={ref} className={classes} {...props}>
        <button
          onClick={_toggle}
          type="button"
          className={buttonClasses}
          aria-controls="mobile-menu"
          aria-expanded="false"
        >
          <span className="sr-only">{sr}</span>
          {_renderIcon()}
        </button>
      </div>
    );
  }
);

NavbarToggler.displayName = 'NavbarToggler';
NavbarToggler.defaultProps = {
  sr: 'Open main menu',
};

export default NavbarToggler;
