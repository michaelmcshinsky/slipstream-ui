import React, { forwardRef, ReactNode } from 'react';

export interface SelectOptionGroupProps {
  label: string;
  children?: ReactNode;
}

export const SelectOptionGroup = forwardRef<
  HTMLOptionsCollection,
  SelectOptionGroupProps
>(({ label, children, ...props }) => {
  return (
    <optgroup label={label} {...props}>
      {children}
    </optgroup>
  );
});

SelectOptionGroup.displayName = 'SelectOptionGroup';

export default SelectOptionGroup;
