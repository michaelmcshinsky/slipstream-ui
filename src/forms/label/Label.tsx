import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TLabel = {
  children?: ReactNode;
  className?: string;
  custom?: boolean;
  disabled?: boolean;
  htmlFor?: any;
  inline?: boolean;
  noMargin?: boolean;
  required?: boolean;
  rtl?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

export const Label = forwardRef<HTMLLabelElement, TLabel>(
  (
    {
      children,
      className,
      custom,
      htmlFor,
      inline,
      noMargin,
      required,
      size,
      rtl,
      ...props
    },
    ref
  ) => {
    const classes = clsx(
      'sui--label',
      !custom && [
        'flex inline-block text-gray-700',
        { 'mb-2': !noMargin && !inline },
        { 'text-xs': size === 'sm' },
        { 'text-sm': size === 'md' || !size },
        { 'text-base': size === 'lg' },
        { 'opacity-50 cursor-not-allowed': props.disabled },
      ],
      rtl && 'flex flex-row-reverse',
      className
    );

    const requirdClasses = clsx(
      'sui--label-required text-red-500',
      rtl ? 'flex order-1 pr-1' : 'pl-1'
    );

    return (
      <label ref={ref} htmlFor={htmlFor} className={classes} {...props}>
        {children}
        {required && <span className={requirdClasses}>*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';
Label.defaultProps = {
  size: 'md',
  noMargin: false,
};

export default Label;
