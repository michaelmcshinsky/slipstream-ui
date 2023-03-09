import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import { TLabel } from '../label';

export type TSwitch = TLabel & {
  checked?: boolean;
  children?: ReactNode;
  color?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  inputsProps?: any;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  right?: boolean;
  shade?:
    | '50'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | string
    | number;
};

export const Switch = forwardRef<HTMLLabelElement, TSwitch>(
  (
    {
      checked,
      children,
      className,
      color,
      disabled,
      inputRef,
      inputsProps,
      onChange,
      required,
      right,
      shade,
      size,
      ...props
    },
    ref
  ) => {
    const labelClasses = clsx(
      'sui--switch',
      'relative inline-flex items-center cursor-pointer',
      { 'opacity-50 cursor-not-allowed': disabled },
      className
    );

    const spanClasses = clsx(
      'flex flex-shrink-0 items-center p-1',
      'border border-solid',
      !!checked === true
        ? `border-${color}${
            color === 'black' || color === 'white' ? '' : `-${shade}`
          }`
        : '',
      'duration-300 ease-in-out bg-gray-300 rounded-full',
      `peer-checked:bg-${color}${
        color === 'black' || color === 'white' ? '' : `-${shade}`
      }`,
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

    const labelInnnerClasses = clsx(
      'text-gray-700',
      { 'text-sm': size === 'sm' },
      { 'text-base': size === 'md' },
      { 'text-lg': size === 'lg' },
      right ? 'pl-2' : 'pr-2'
    );

    const inputClasses = clsx(
      'absolute hidden w-full h-full -translate-x-1/2 rounded-md appearance-none left-1/2 peer',
      inputsProps?.className
    );

    return (
      <label ref={ref} className={labelClasses} {...props}>
        {!right && children ? (
          <span className={labelInnnerClasses}>{children}</span>
        ) : null}
        <input
          {...inputsProps}
          checked={checked}
          disabled={disabled}
          required={required}
          onChange={onChange}
          className={inputClasses}
          ref={inputRef}
          type="checkbox"
          style={{ display: 'none' }}
        />
        <span className={spanClasses}></span>
        {right && children ? (
          <span className={labelInnnerClasses}>{children}</span>
        ) : null}
      </label>
    );
  }
);

Switch.displayName = 'Switch';
Switch.defaultProps = {
  color: 'blue',
  size: 'md',
  shade: '500',
};

export default Switch;
