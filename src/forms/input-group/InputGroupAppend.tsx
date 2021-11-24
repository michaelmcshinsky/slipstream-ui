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
    'flex items-center bg-gray-200 px-3',
    'text-base leading-tight text-center whitespace-nowrap',
    'border border-solid border-gray-300 -ml-px',
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
