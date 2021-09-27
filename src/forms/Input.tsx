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
  name?: string;
  autoComplete?: string;
  list?: string;
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
    ...attrs
  } = props;

  const classes = classNames(
    { 'w-full': !inline },
    theme.form.base,
    invalid
      ? theme.form.invalid
      : success
      ? theme.form.success
      : theme.form.default,
    { [theme.form.size.sm]: size === 'sm' },
    { [theme.form.size.md]: size === 'md' || !size },
    { [theme.form.size.lg]: size === 'lg' },
    disabled && theme.disabled,
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
      {...attrs}
    />
  );
});

export default Input;
