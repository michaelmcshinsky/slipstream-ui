import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface InputGroupAppendProps {
  className?: string;
  children: ReactNode;
  size?: string;
  custom?: boolean;
}

export const InputGroupAppend = forwardRef<
  HTMLDivElement,
  InputGroupAppendProps
>(({ className, children, size, custom, ...props }, ref) => {
  const classes = classNames(
    'sui--input-group_prepend',
    'flex self-stretch items-center bg-gray-200',
    'leading-tight text-center whitespace-nowrap',
    'border border-solid border-gray-300 -ml-px',
    !custom && [
      { 'text-xs': size === 'sm' },
      { 'text-sm': size === 'md' || !size },
      { 'text-base': size === 'lg' },
    ],
    { 'px-2': size === 'sm' },
    { 'px-3': size === 'md' || !size },
    { 'px-4': size === 'lg' },
    className,
  );

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

InputGroupAppend.displayName = 'InputGroupAppend';

export default InputGroupAppend;
