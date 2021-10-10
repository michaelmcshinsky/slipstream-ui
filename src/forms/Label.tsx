import React, { forwardRef, ReactNode } from 'react';
import classnames from 'classnames';

export interface LabelProps {
  htmlFor?: any;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
  noMargin?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>((props, ref) => {
  const {
    className,
    htmlFor,
    disabled,
    size = 'md',
    children,
    noMargin,
    ...attributes
  } = props;

  const classes = classnames(
    'sui--label',
    'inline-block text-gray-700',
    { 'mb-2': !noMargin },
    { 'text-xs': size === 'sm' },
    { 'text-sm': size === 'md' || !size },
    { 'text-base': size === 'lg' },
    { 'opacity-50': disabled },
    className
  );

  return (
    <label ref={ref} htmlFor={htmlFor} className={classes} {...attributes}>
      {children}
    </label>
  );
});

Label.defaultProps = {
  noMargin: false,
};

export default Label;
