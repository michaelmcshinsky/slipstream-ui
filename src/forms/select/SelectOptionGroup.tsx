import React, { ReactNode } from 'react';

export interface SelectOptionGroupProps {
  label: string;
  children?: ReactNode;
}

export const SelectOptionGroup = ({ label, children, ...props }: SelectOptionGroupProps) => (
  <optgroup label={label} {...props}>
  {children}
</optgroup>
)

SelectOptionGroup.displayName = 'SelectOptionGroup';

export default SelectOptionGroup;
