import React, { forwardRef, ReactNode, HTMLAttributes } from 'react';
import classNames from 'classnames';
import theme from '../theme/default';

export interface SelectProps extends HTMLAttributes<HTMLSelectElement> {
  className?: string;
  disabled?: boolean;
  invalid?: boolean;
  success?: boolean;
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  children?: ReactNode;
  rtl?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    const {
      className,
      disabled = false,
      invalid,
      success,
      size = 'md',
      children,
      rounded,
      rtl,
      ...attrs
    } = props;

    const classes = classNames(
      'sui--select w-full appearance-none',
      theme.form.base,
      invalid
        ? theme.form.invalid
        : success
        ? theme.form.success
        : theme.form.default,
        { 'h-7': size === 'sm' },
        { 'h-8': size === 'md' || !size },
        { 'h-10': size === 'lg' },
      { [theme.form.size.sm]: size === 'sm' },
      { [theme.form.size.md]: size === 'md' || !size },
      { [theme.form.size.lg]: size === 'lg' },
      disabled && theme.disabled,
      rounded ? 'rounded-full' : 'rounded',
      className
    );

    return (
      <select
        ref={ref}
        className={classes}
        disabled={disabled}
        dir={rtl ? 'rtl' : 'auto'}
        {...attrs}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';

export default Select;
