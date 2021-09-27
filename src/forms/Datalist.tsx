import React, { forwardRef } from 'react';
import { Input, InputProps } from './Input';

export interface DatalistProps extends InputProps {
  id: string;
  list: string;
  options?: DatalistOption[];
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
}

export interface DatalistOption {
  value: string;
  label: string;
}

export const Datalist = forwardRef<HTMLInputElement, DatalistProps>(
  ({ id, options, ...props }, ref) => {
    return (
      <>
        <Input ref={ref} {...props} />
        <datalist id={id}>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </datalist>
      </>
    );
  }
);

Datalist.displayName = 'Datalist';

Datalist.defaultProps = {
  autoComplete: 'on',
};

export default Datalist;
