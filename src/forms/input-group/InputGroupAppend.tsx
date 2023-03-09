import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TInputGroupAppend = {
  className?: string;
  children?: ReactNode;
  size?: string;
  custom?: boolean;
  invalid?: boolean;
};

export const InputGroupAppend = forwardRef<HTMLDivElement, TInputGroupAppend>(
  ({ className, children, size, custom, invalid, ...props }, ref) => {
    const classes = clsx(
      'sui--input-group_prepend',
      !custom && [
        'border border-solid border-l-0 rounded-r',
        'self-stretch flex items-center justify-center',
        'bg-gray-100',
        invalid ? 'border-red-400' : 'border-gray-300',
        { 'text-xs': size === 'sm' },
        { 'text-sm': size === 'md' || !size },
        { 'text-base': size === 'lg' },
      ],
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
  }
);

InputGroupAppend.displayName = 'InputGroupAppend';

export default InputGroupAppend;
