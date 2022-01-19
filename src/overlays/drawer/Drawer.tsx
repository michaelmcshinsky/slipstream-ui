import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  ReactNode,
} from 'react';
import { Backdrop } from '../..';
import classNames from 'classnames';

export interface DrawerProps {
  children?: ReactNode;
  className?: string;
  custom?: boolean;
  direction?: 'top' | 'right' | 'bottom' | 'left';
  full?: boolean;
  isOpen?: boolean;
  toggle?: () => void;
}

export type DrawerElement = {
  toggle?: () => void;
};

export const Drawer = forwardRef<DrawerElement, DrawerProps>(
  (
    {
      children,
      className,
      custom,
      direction,
      full,
      isOpen,
      toggle,
      ...props
    },
    ref
  ) => {
    useEffect(() => {
      document.addEventListener('keydown', (e: any) => handleEsc(e), {
        capture: true,
      });
      return () => {
        document.removeEventListener('keydown', (e: any) => handleEsc(e));
      };
    }, []);

    useImperativeHandle(ref, () => ({
      toggle: _toggle,
    }));

    function handleEsc(ev: React.KeyboardEvent<Document>) {
      if (ev.key === 'Esc' || ev.key === 'Escape') {
        _toggle();
      }
    }

    const classes = classNames(
      'sui--offcanvas--menu',
      'fixed duration-500 dark:bg-gray-900 dark:text-gray-300',
      { 'w-full h-full': full },
      direction === 'top' && [
        isOpen ? 'translate-y-0' : '-translate-y-full',
        'top-0 right-0 left-0',
      ],
      direction === 'right' && [
        isOpen ? 'translate-x-100' : 'translate-x-full',
        'top-0 right-0 bottom-0',
      ],
      direction === 'bottom' && [
        isOpen ? '-translate-y-0' : 'translate-y-full',
        'right-0 bottom-0 left-0',
      ],
      direction === 'left' && [
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'top-0 bottom-0 left-0',
      ],
      !custom && ['bg-white'],
      className
    );

    //escape key
    // way for user to callback out of full screen

    function _toggle() {
      if (toggle) {
        toggle();
      }
    }

    return (
      <>
        <div className={classes} style={{ zIndex: 10000 }} {...props}>
          {children}
        </div>
        <Backdrop isOpen={!!isOpen} toggle={_toggle}></Backdrop>
      </>
    );
  }
);

Drawer.displayName = 'Drawer';
Drawer.defaultProps = {
  direction: 'left',
};

export default Drawer;
