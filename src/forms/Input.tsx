import React from 'react';
import classNames from 'classnames';

export interface InputProps {
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  success?: boolean;
  size?: string;
  type?: string;
};

export function Input(props: InputProps) {
  const { className, placeholder, disabled, invalid, success, size, type, ...attrs } = props;

  const classes = classNames(
    'border border-solid rounded focus:border-black transition-colors duration-500',
    'active:border-blue-500 outline-none focus:outline-none focus:border-blue-500',
    'w-full leading-tight',
    invalid ? 'border-red-400' : success ? 'border-green-500' : 'border-gray-300',
    { 'text-xs py-1 px-2': size === 'sm' },
    { 'text-sm p-2': size === 'md' || !size },
    { 'text-base py-2 px-3': size === 'lg' },
    { 'opacity-50 bg-gray-100 cursor-not-allowed' : disabled },
    className
  );

  return (
    <input
      className={classes}
      placeholder={placeholder}
      type={type}
      {...attrs}
    />
  );
}

export default Input;