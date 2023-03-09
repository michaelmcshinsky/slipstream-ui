import React, { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import theme from '../../theme/default';

export type TInput
  = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  autoComplete?: string;
  checked?: boolean | undefined;
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

export const Input = forwardRef<HTMLInputElement, TInput>(
  (
    {
      className,
      inline,
      invalid,
      success,
      size,
      rounded,
      rtl,
      tag: Tag,
      custom,
      ...props
    },
    ref
  ) => {
    const classes = clsx(
      { 'sui--input': Tag === 'input' },
      'relative',
      { 'w-full': !inline },
      !custom && [
        theme.form.base,
        invalid
          ? theme.form.invalid
          : success
          ? theme.form.success
          : theme.form.default,
        {
          'h-7':
            props.type !== 'radio' &&
            props.type !== 'checkbox' &&
            size === 'sm' &&
            Tag !== 'textarea',
        },
        {
          'h-8':
            ((props.type !== 'radio' &&
              props.type !== 'checkbox' &&
              size === 'md') ||
              !size) &&
            Tag !== 'textarea',
        },
        {
          'h-10':
            props.type !== 'radio' &&
            props.type !== 'checkbox' &&
            size === 'lg' &&
            Tag !== 'textarea',
        },
        { 'text-xs': size === 'sm' },
        { 'text-sm': size === 'md' || !size },
        { 'text-base': size === 'lg' },
        props.type === 'checkbox' || props.type === 'radio' ? 'p-0' : 'px-2',
        props.disabled && theme.disabled,
        rounded || props?.type === 'radio' ? 'rounded-full' : 'rounded',
      ],
      className
    );

    return (
      <Tag
        ref={ref}
        className={classes}
        dir={rtl ? 'rtl' : 'auto'}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
Input.defaultProps = {
  size: 'md',
  tag: 'input',
  type: 'text',
};

export default Input;
