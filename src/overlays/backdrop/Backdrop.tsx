import React, { useState, useEffect, forwardRef, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';

export type TBackdrop = {
  children?: ReactNode;
  className?: string;
  custom?: boolean;
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

export const Backdrop = forwardRef<HTMLDivElement, TBackdrop>(
  (
    {
      children,
      className,
      custom,
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
    const [isHidden, setIsHidden] = useState(!isOpen);

    useEffect(() => {
      if (isOpen) {
        setIsHidden(false);
      } else {
        setTimeout(
          () => {
            setIsHidden(true);
          },
          duration ? Number(duration) : 500
        );
      }
    }, [isOpen]);

    const classes = clsx(
      'sui--backdrop',
      'fixed bg-black bg-opacity-50',
      'transition-opacity transform ease-in-out',
      `duration-${duration}`,
      isOpen ? 'opacity-1' : 'opacity-0',
      { invisible: isHidden && !isOpen },
      { 'flex items-center justify-center inset-0' : !custom },
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
