import React, { forwardRef, ReactNode } from 'react';
import classnames from 'classnames';

export interface LabelProps {
  htmlFor?: any;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>((props, ref) => {
  const { className, htmlFor, size = 'md', children, ...attributes } = props;
  const classes = classnames(
    'inline-block mb-2 text-gray-700',
    { 'text-xs': size === 'sm' },
    { 'text-sm': size === 'md' || !size },
    { 'text-base': size === 'lg' },
    className
  );

  return (
    <label ref={ref} htmlFor={htmlFor} className={classes} {...attributes}>
      {children}
    </label>
  );
});

export default Label;
