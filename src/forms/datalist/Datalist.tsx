import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { Input, TInput } from '../input/Input';

export type DatalistOption = {
  value: string;
  label: string;
};

export type TDatalist = TInput & {
  className?: string;
  custom?: boolean;
  id: string;
  list: string;
  options?: DatalistOption[];
  datalistProps?: any;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
};

export const Datalist = forwardRef<HTMLInputElement, TDatalist>(
  ({ id, options, className, datalistProps, ...props }, ref) => {
    const classes = clsx('sui--datalist', className);

    return (
      <>
        <Input ref={ref} className={classes} {...props} />
        <datalist id={id} {...datalistProps}>
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
