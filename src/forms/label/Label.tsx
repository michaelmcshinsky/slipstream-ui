import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface LabelProps {
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
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>((props, ref) => {
  const {
    children,
    className,
    custom,
    htmlFor,
    inline,
    noMargin,
    required,
    size,
    rtl,
    ...attrs
  } = props;

  const classes = classNames(
    'sui--label',
    !custom && [
      'flex inline-block text-gray-700',
      { 'mb-2': !noMargin && !inline },
      { 'text-xs': size === 'sm' },
      { 'text-sm': size === 'md' || !size },
      { 'text-base': size === 'lg' },
      { 'opacity-50 cursor-not-allowed': attrs.disabled },
    ],
    rtl && 'flex flex-row-reverse',
    className
  );

  const requirdClasses = classNames(
    'sui--label-required text-red-500',
    rtl ? 'flex order-1 pr-1' : 'pl-1'
  );

  return (
    <label ref={ref} htmlFor={htmlFor} className={classes} {...attrs}>
      {children}
      {required && <span className={requirdClasses}>*</span>}
    </label>
  );
});

Label.defaultProps = {
  size: 'md',
  noMargin: false,
};

export default Label;
