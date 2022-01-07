import React, { useState, useEffect, forwardRef, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

export interface BackdropProps {
  children?: ReactNode;
  className?: string;
  isOpen: boolean;
  styles?: object;
  toggle?: () => void;
  usePortal?: boolean;
  zIndex?: number;
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
    | '1000'
    | string
    | number;
}

export const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(
  (
    {
      children,
      className,
      duration,
      isOpen,
      styles,
      toggle,
      usePortal,
      zIndex,
      ...props
    },
    ref
  ) => {
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

    const classes = classNames(
      'sui--backdrop',
      'fixed flex item-center justify-center inset-0',
      'bg-black bg-opacity-50',
      'transition-opacity transform ease-in-out',
      `duration-${duration}`,
      isOpen ? 'opacity-1' : 'opacity-0',
      { invisible: hidden && !isOpen },
      className
    );

    const backdropStyles = {
      zIndex,
      ...styles,
    };

    if (usePortal) {
      return ReactDOM.createPortal(
        <div
          ref={ref}
          className={classes}
          onClick={toggle}
          style={backdropStyles}
          {...props}
        >
          {children}
        </div>,
        document.body
      );
    }

    return (
      <div
        ref={ref}
        className={classes}
        onClick={toggle}
        style={backdropStyles}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Backdrop.displayName = 'Backdrop';
Backdrop.defaultProps = {
  duration: '500',
  usePortal: false,
  zIndex: 9999,
};

export default Backdrop;
