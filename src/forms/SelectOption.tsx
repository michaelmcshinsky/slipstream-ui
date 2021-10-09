import React, { ReactNode } from 'react';

export interface SelectOptionProps {
  children?: ReactNode;
  value: string;
}

export function SelectOption({ children, ...props }: SelectOptionProps) {
  return <option {...props}>{children}</option>;
}

SelectOption.displayName = 'SelectOption'

export default SelectOption;
