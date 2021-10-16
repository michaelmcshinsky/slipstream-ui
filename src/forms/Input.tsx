import React, { forwardRef, HTMLAttributes } from 'react';
import classNames from 'classnames';
import theme from '../theme/default';

export interface InputProps extends HTMLAttributes<HTMLInputElement> {
  id?: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  success?: boolean;
  checked?: boolean;
  inline?: boolean;
  value?: any;
  size?: 'sm' | 'md' | 'lg';
  type?: string;
  rounded?: boolean;
  name?: string;
  autoComplete?: string;
  list?: string;
  rtl?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    id,
    className,
    placeholder,
    required,
    disabled,
    checked,
    inline,
    value,
    invalid,
    success,
    size,
    type,
    rounded,
    rtl,
    ...attrs
  } = props;

  const classes = classNames(
    'sui--input',
    { 'w-full': !inline },
    theme.form.base,
    invalid
      ? theme.form.invalid
      : success
      ? theme.form.success
      : theme.form.default,
    { 'h-7': type !== 'radio' && type !== 'checkbox' && size === 'sm' },
    { 'h-8': type !== 'radio' && type !== 'checkbox' && size === 'md' || !size },
    { 'h-10': type !== 'radio' && type !== 'checkbox' && size === 'lg' },
    { [theme.form.size.sm]: size === 'sm' },
    { [theme.form.size.md]: size === 'md' || !size },
    { [theme.form.size.lg]: size === 'lg' },
    disabled && theme.disabled,
    rounded ? 'rounded-full' : 'rounded',
    className
  );

  return (
    <input
      ref={ref}
      id={id}
      className={classes}
      required={required}
      disabled={disabled}
      checked={checked}
      value={value}
      placeholder={placeholder}
      type={type}
      dir={rtl ? 'rtl' : 'auto'}
      {...attrs}
    />
  );
});

Input.displayName = 'Input';
Input.defaultProps = {
  size: 'md',
};

export default Input;
