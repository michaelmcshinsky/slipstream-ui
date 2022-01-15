import React, { forwardRef, HTMLAttributes } from 'react';
import classNames from 'classnames';
import theme from '../../theme/default';

export interface InputProps extends HTMLAttributes<HTMLInputElement> {
  autoComplete?: string;
  checked?: string | boolean;
  className?: string;
  custom?: boolean;
  disabled?: boolean;
  id?: string;
  inline?: boolean;
  invalid?: boolean;
  list?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  rounded?: boolean;
  rtl?: boolean;
  size?: 'sm' | 'md' | 'lg';
  success?: boolean;
  tag?: any;
  type?: string;
  value?: any;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    className,
    inline,
    invalid,
    success,
    size,
    rounded,
    rtl,
    tag: Tag,
    custom,
    ...attrs
  } = props;

  const classes = classNames(
    { 'sui--input': Tag === 'input' },
    'relative',
    { 'w-full': !inline },
    !custom && [
      theme.form.base,
      { 'dark:text-gray-300 dark:bg-transparent' : !!attrs.checked !== true },
      invalid
        ? theme.form.invalid
        : success
        ? theme.form.success
        : theme.form.default,
      {
        'h-7':
          attrs.type !== 'radio' &&
          attrs.type !== 'checkbox' &&
          size === 'sm' &&
          Tag !== 'textarea',
      },
      {
        'h-8':
          ((attrs.type !== 'radio' &&
            attrs.type !== 'checkbox' &&
            size === 'md') ||
            !size) &&
          Tag !== 'textarea',
      },
      {
        'h-10':
          attrs.type !== 'radio' &&
          attrs.type !== 'checkbox' &&
          size === 'lg' &&
          Tag !== 'textarea',
      },
      { 'text-xs': size === 'sm' },
      { 'text-sm': size === 'md' || !size },
      { 'text-base': size === 'lg' },
      attrs.type === 'checkbox' || attrs.type === 'radio' ? 'p-0' : 'px-2',
      attrs.disabled && theme.disabled,
      rounded || attrs?.type === 'radio' ? 'rounded-full' : 'rounded',
    ],
    className,
  );

  return (
    <Tag ref={ref} className={classes} dir={rtl ? 'rtl' : 'auto'} {...attrs} />
  );
});

Input.displayName = 'Input';
Input.defaultProps = {
  size: 'md',
  tag: 'input',
  type: 'text',
};

export default Input;
