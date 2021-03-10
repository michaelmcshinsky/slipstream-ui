import React, { forwardRef, HTMLAttributes } from 'react';
import classNames from 'classnames';
import theme from '../theme/default';

export interface InputProps extends HTMLAttributes<HTMLInputElement> {
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  success?: boolean;
  size?: 'sm' | 'md' | 'lg';
  type?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    className,
    placeholder,
    disabled,
    invalid,
    success,
    size,
    type,
    ...attrs
  } = props;

  const classes = classNames(
    'w-full',
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
      className={classes}
      disabled={disabled}
      placeholder={placeholder}
      type={type}
      {...attrs}
    />
  );
});

export default Input;
