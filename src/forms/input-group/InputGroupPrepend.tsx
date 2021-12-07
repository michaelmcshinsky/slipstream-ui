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
    'flex self-stretch items-center bg-gray-200',
    'leading-tight text-center whitespace-nowrap',
    'border border-solid border-gray-300 -mr-px',
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

InputGroupPrepend.displayName = 'InputGroupPrepend';

export default InputGroupPrepend;
