import React, { ReactNode, forwardRef } from 'react';

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
    ref
  ) => {
    if (!isOpen) {
      return null;
    }

    return (
      <div
        ref={mergeRefs(ref, outsideRef, setPopperElement)}
        style={styles.popper}
        className="sui--dropdown-menu border border-solid border-gray-300 rounded bg-white py-1"
        {...attributes.popper}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DropdownMenu.displayName = 'DropdownMenu';

const mergeRefs = (...refs: any[]) => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return (inst: any) => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };
};

export default DropdownMenu;