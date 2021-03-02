import React, { ReactNode } from 'react';
import classnames from 'classnames';

export interface LabelProps {
  className?: string;
  size?: string;
  children?: ReactNode;
}

export function Label(props: LabelProps) {
  const { className, size, children } = props;
  const classes = classnames(
    'inline-block mb-2 text-gray-700', 
  { 'text-xs': size === 'sm' },
  { 'text-sm': size === 'md' || !size },
  { 'text-base': size === 'lg' },
  className)

  return (
    <label className={classes}>
      {children}
    </label>
  )
}

export default Label