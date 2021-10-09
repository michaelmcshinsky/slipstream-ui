import React, { ReactNode } from 'react';

export interface SelectOptionGroupProps {
  label: string;
  children?: ReactNode;
}

export function SelectOptionGroup({
  label,
  children,
  ...props
}: SelectOptionGroupProps) {
  return (
    <optgroup label={label} {...props}>
      {children}
    </optgroup>
  );
}

SelectOptionGroup.displayName = 'SelectOptionGroup';

export default SelectOptionGroup;
