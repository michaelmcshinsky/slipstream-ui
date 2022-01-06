import React, { useState, useEffect, forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface BackdropProps {
  children?: ReactNode;
  className?: string;
  isOpen: boolean;
  toggle?: () => void;
  duration?:
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | '1000';
}

export const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(
  ({ children, className, isOpen, toggle, duration, ...props }, ref) => {
    const [hidden, setHidden] = useState(!isOpen);

    useEffect(() => {
      if (isOpen) {
        setHidden(false);
      } else {
        setTimeout(
          () => {
            setHidden(true);
          },
          duration ? Number(duration) : 500
        );
      }
    }, [isOpen]);

    function _toggle() {
      if (toggle) {
        toggle();
      }
    }

    const classes = classNames(
      'sui--backdrop',
      'fixed flex item-center justify-center inset-0',
      'bg-black bg-opacity-50',
      'transition-opacity transform ease-in-out',
      duration ? `duration-${duration}` : 'duration-500',
      isOpen ? 'opacity-1' : 'opacity-0',
      { invisible: hidden && !isOpen },
      className
    );

    return (
      <div ref={ref} className={classes} onClick={_toggle} {...props}>
        {children}
      </div>
    );
  }
);

Backdrop.displayName = 'Backdrop';

export default Backdrop;
