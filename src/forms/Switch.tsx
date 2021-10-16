import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import { InputProps } from './Input';

export interface SwitchProps {
  checked?: boolean;
  children?: ReactNode;
  color?: string;
  inputsProps?: InputProps;
  label?: ReactNode;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  right?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Switch = forwardRef<HTMLElement, SwitchProps>(
  (
    { label, color, checked, onChange, inputsProps, right, size, ...props },
    ref
  ) => {
    const spanClasses = classNames(
      'flex flex-shrink-0 items-center p-1',
      'duration-300 ease-in-out bg-gray-300 rounded-full',
      `peer-checked:bg-${color}-500`,
      'after:bg-white after:rounded-full',
      'after:shadow-md after:duration-300',
      {
        'w-11 h-7 after:w-5 after:h-5 peer-checked:after:translate-x-4':
          size === 'sm',
      },
      {
        'w-14 h-8 after:w-6 after:h-6 peer-checked:after:translate-x-6':
          size === 'md',
      },
      {
        'w-16 h-10 after:w-8 after:h-8 peer-checked:after:translate-x-6':
          size === 'lg',
      }
    );

    const labelClasses = classNames(
      'text-gray-700',
      size === 'sm' && 'text-sm',
      size === 'md' && 'text-base',
      size === 'lg' && 'text-lg',
      right ? 'pl-2' : 'pr-2'
    );

    return (
      <label
        className="relative inline-flex items-center justify-between cursor-pointer"
        {...props}
      >
        {!right && <span className={labelClasses}>{label}</span>}
        <input
          type="checkbox"
          className="absolute hidden w-full h-full -translate-x-1/2 rounded-md appearance-none left-1/2 peer"
          checked={checked}
          onChange={onChange}
          {...inputsProps}
        />
        <span className={spanClasses}></span>
        {right && <span className={labelClasses}>{label}</span>}
      </label>
    );
  }
);

Switch.displayName = 'Switch';
Switch.defaultProps = {
  color: 'blue',
  size: 'md',
};

export default Switch;
