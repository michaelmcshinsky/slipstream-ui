import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface InputGroupAppendProps {
  className?: string;
  children?: ReactNode;
  size?: string;
}

export const InputGroupAppend = forwardRef<
  HTMLDivElement,
  InputGroupAppendProps
>(({ className, children, size, ...props }, ref) => {
  const classes = classNames(
    'sui--input-group_prepend',
    'flex self-stretch items-center bg-gray-200',
    'leading-tight text-center whitespace-nowrap',
    'border border-solid border-gray-300 -ml-px',
    { 'text-xs px-2': size === 'sm' },
    { 'text-sm px-3': size === 'md' || !size },
    { 'text-base px-4': size === 'lg' },
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
