import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface InputGroupPrependProps {
  className?: string;
  children?: ReactNode;
  size?: string;
}

export const InputGroupPrepend = forwardRef<
  HTMLDivElement,
  InputGroupPrependProps
>(({ className, children, size, ...props }, ref) => {
  const classes = classNames(
    'sui--input-group_prepend',
    'flex items-center bg-gray-200',
    'text-base leading-tight text-center whitespace-nowrap',
    'border border-solid border-gray-300 -mr-px',
    { 'px-2': size === 'sm' },
    { 'px-3': size === 'md' || !size },
    { 'px-4': size === 'lg' },
    className
  );

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

InputGroupPrepend.displayName = 'InputGroupPrepend';

export default InputGroupPrepend;
