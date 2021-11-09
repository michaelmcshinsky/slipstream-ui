import React, { forwardRef, ReactNode } from 'react';

export interface SelectOptionProps {
  children?: ReactNode;
  value: string;
}

export const SelectOption = forwardRef<HTMLOptionElement, SelectOptionProps>(
  ({ children, ...props }) => {
    return <option {...props}>{children}</option>;
  }
);

SelectOption.displayName = 'SelectOption';

export default SelectOption;
