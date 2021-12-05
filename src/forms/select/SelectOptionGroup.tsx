import React, { forwardRef, ReactNode } from 'react';

export interface SelectOptionGroupProps {
  label?: string;
  disabled?: boolean;
  children?: ReactNode;
}

export const SelectOptionGroup = forwardRef<
  HTMLOptGroupElement,
  SelectOptionGroupProps
>(({ children, label, ...props }, ref) => {
  return (
    <optgroup ref={ref} label={label} {...props}>
      {children}
    </optgroup>
  );
});

SelectOptionGroup.displayName = 'SelectOptionGroup';

export default SelectOptionGroup;
