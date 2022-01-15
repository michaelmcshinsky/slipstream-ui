import React, { ReactNode, forwardRef } from 'react';
import classNames from 'classnames';
import { mergeRefs } from '../../utils';

export interface DropdownMenuProps {
  attributes?: any;
  children?: ReactNode;
  className?: string;
  isOpen?: boolean;
  outsideRef?: any;
  setPopperElement?: any;
  styles?: any;
}

export const DropdownMenu = forwardRef<HTMLElement, DropdownMenuProps>(
  (
    {
      attributes,
      children,
      className,
      isOpen,
      outsideRef,
      setPopperElement,
      styles,
      ...props
    },
    ref,
  ) => {
    if (!isOpen) {
      return null;
    }

    const classes = classNames(
      'sui--dropdown-menu',
      'py-1 bg-white border border-gray-300 border-solid rounded',
      'dark:bg-gray-900'
    )

    return (
      <div
        ref={mergeRefs(ref, outsideRef, setPopperElement)}
        style={styles.popper}
        className={classes}
        {...attributes.popper}
        {...props}
      >
        {children}
      </div>
    );
  },
);

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;