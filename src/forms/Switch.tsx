import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { LabelProps } from './Label';

export interface SwitchProps extends LabelProps {
  checked?: boolean;
  children?: ReactNode;
  color?: string;
  inputsProps?: any;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  right?: boolean;
}

export function Switch({
  checked,
  className,
  children,
  color,
  disabled,
  inputsProps,
  onChange,
  required,
  right,
  size,
  ...props
}: SwitchProps) {
  const labelClasses = classNames(
    'sui--switch',
    'relative inline-flex items-center cursor-pointer',
    { 'opacity-50 cursor-not-allowed': disabled },
    className
  );

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

  const labelInnnerClasses = classNames(
    'text-gray-700',
    { 'text-sm': size === 'sm' },
    { 'text-base': size === 'md' },
    { 'text-lg': size === 'lg' },
    right ? 'pl-2' : 'pr-2'
  );

  return (
    <label className={labelClasses} {...props}>
      {!right && children ? (
        <span className={labelInnnerClasses}>{children}</span>
      ) : null}
      <input
        type="checkbox"
        className="absolute hidden w-full h-full -translate-x-1/2 rounded-md appearance-none left-1/2 peer"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        required={required}
        {...inputsProps}
      />
      <span className={spanClasses}></span>
      {right && children ? (
        <span className={labelInnnerClasses}>{children}</span>
      ) : null}
    </label>
  );
}

Switch.displayName = 'Switch';
Switch.defaultProps = {
  color: 'blue',
  size: 'md',
};

export default Switch;
