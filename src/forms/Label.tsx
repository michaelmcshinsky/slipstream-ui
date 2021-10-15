import React, { forwardRef, ReactNode } from 'react';
import classnames from 'classnames';

export interface LabelProps {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  htmlFor?: any;
  noMargin?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  inline?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>((props, ref) => {
  const {
    children,
    className,
    disabled,
    htmlFor,
    noMargin,
    required,
    size,
    inline,
    ...attrs
  } = props;

  const classes = classnames(
    'sui--label',
    'flex inline-block text-gray-700',
    { 'mb-2': !noMargin && !inline },
    { 'text-xs': size === 'sm' },
    { 'text-sm': size === 'md' || !size },
    { 'text-base': size === 'lg' },
    { 'opacity-50 cursor-not-allowed': disabled },
    className
  );

  return (
    <label ref={ref} htmlFor={htmlFor} className={classes} {...attrs}>
      {children}
      {required && <span className="text-red-500 pl-1">*</span>}
    </label>
  );
});

Label.defaultProps = {
  size: 'md',
  noMargin: false,
};

export default Label;
