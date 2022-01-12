import React, { ReactNode, forwardRef } from 'react';
import { mergeRefs } from '../../utils';

export interface DropdownMenuProps {
  outsideRef?: any;
  setPopperElement?: any;
  children?: ReactNode;
  styles?: any;
  attributes?: any;
  isOpen?: boolean;
}

export const DropdownMenu = forwardRef<HTMLElement, DropdownMenuProps>(
  (
    {
      outsideRef,
      setPopperElement,
      children,
      styles,
      attributes,
      isOpen,
      ...props
    },
    ref,
  ) => {
    if (!isOpen) {
      return null;
    }

    return (
      <div
        ref={mergeRefs(ref, outsideRef, setPopperElement)}
        style={styles.popper}
        className="py-1 bg-white border border-gray-300 border-solid rounded sui--dropdown-menu"
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