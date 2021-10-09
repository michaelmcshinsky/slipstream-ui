import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { Input, InputProps } from './Input';

export interface DatalistProps extends InputProps {
  id: string;
  list: string;
  options?: DatalistOption[];
  className?: string;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
}

export interface DatalistOption {
  value: string;
  label: string;
}

export const Datalist = forwardRef<HTMLInputElement, DatalistProps>(
  ({ id, options, className, ...props }, ref) => {
    const classes = classNames('sui--datalist', className);

    return (
      <>
        <Input ref={ref} className={classes} {...props} />
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
