import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import { LabelProps } from '../label';

export interface SwitchProps extends LabelProps {
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
}

export const Switch = forwardRef<HTMLLabelElement, SwitchProps>(
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
    const labelClasses = classNames(
      'sui--switch',
      'relative inline-flex items-center cursor-pointer',
      { 'opacity-50 cursor-not-allowed': disabled },
      className
    );

    const spanClasses = classNames(
      'flex flex-shrink-0 items-center p-1',
      'border border-solid',
      !!checked === true
        ? `border-${color}${
            color === 'black' || color === 'white' ? '' : `-${shade}`
          }`
        : 'dark:border-gray-300',
      'duration-300 ease-in-out bg-gray-300 dark:bg-transparent rounded-full',
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

    const labelInnnerClasses = classNames(
      'text-gray-700 dark:text-gray-300',
      { 'text-sm': size === 'sm' },
      { 'text-base': size === 'md' },
      { 'text-lg': size === 'lg' },
      right ? 'pl-2' : 'pr-2'
    );

    return (
      <label ref={ref} className={labelClasses} {...props}>
        {!right && children ? (
          <span className={labelInnnerClasses}>{children}</span>
        ) : null}
        <input
          ref={inputRef}
          type="checkbox"
          className="absolute hidden w-full h-full -translate-x-1/2 rounded-md appearance-none left-1/2 peer"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          style={{ display: 'none' }}
          {...inputsProps}
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
