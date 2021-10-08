import React, { ReactNode } from 'react';

export interface DropdownMenuProps {
  outsideRef?: any;
  setPopperElement?: any;
  children?: ReactNode;
  styles?: any;
  attributes?: any;
  isOpen?: boolean;
}

export function DropdownMenu({
  outsideRef,
  setPopperElement,
  children,
  styles,
  attributes,
  isOpen,
  ...props
}: DropdownMenuProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={mergeRefs(outsideRef, setPopperElement)}
      style={styles.popper}
      className="border border-solid border-gray-300 rounded bg-white py-1"
      {...attributes.popper}
      {...props}
    >
      {children}
    </div>
  );
}

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
