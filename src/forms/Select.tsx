import React, { forwardRef, ReactNode, HTMLAttributes } from 'react';
import classNames from 'classnames';
import theme from '../theme/default';

export interface SelectProps extends HTMLAttributes<HTMLSelectElement> {
  className?: string;
  disabled?: boolean;
  invalid?: boolean;
  success?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
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
      <select
        ref={ref}
        className={classes}
        disabled={disabled}
        {...attrs}
      >
        {children}
      </select>
    );
  }
);

export default Select;
