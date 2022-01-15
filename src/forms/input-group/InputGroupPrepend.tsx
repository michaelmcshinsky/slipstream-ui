import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface InputGroupPrependProps {
  className?: string;
  children?: ReactNode;
  size?: string;
  custom?: boolean;
  invalid?: boolean;
}

export const InputGroupPrepend = forwardRef<
  HTMLDivElement,
  InputGroupPrependProps
>(({ className, children, size, custom, invalid, ...props }, ref) => {
  const classes = classNames(
    'sui--input-group_prepend',
    'border border-solid border-r-0 rounded-l',
    'self-stretch flex items-center justify-center',
    'bg-gray-100 dark:bg-transparent text-gray-700 dark:text-gray-300',
    invalid ? 'border-red-400' : 'border-gray-300',
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

InputGroupPrepend.displayName = 'InputGroupPrepend';

export default InputGroupPrepend;
