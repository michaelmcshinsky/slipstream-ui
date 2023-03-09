import React, { forwardRef, ReactNode } from 'react';

export type TSelectOption = {
  children?: ReactNode;
  value: string;
}

export const SelectOption = forwardRef<HTMLOptionElement, TSelectOption>(
  ({ children, ...props }, ref) => {
    return (
      <option ref={ref} {...props}>
        {children}
      </option>
    );
  },
);

SelectOption.displayName = 'SelectOption';

export default SelectOption;
