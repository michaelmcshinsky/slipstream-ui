import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { Input, TInput } from '../input/Input';

export type TTextarea = TInput & {
  rows?: string | number;
  className?: string;
};

export const Textarea = forwardRef<HTMLInputElement, TTextarea>(
  ({ className, ...props }, ref) => {
    const classes = clsx('sui--textarea', className);
    return <Input ref={ref} className={classes} {...props} tag="textarea" />;
  }
);

Textarea.displayName = 'Textarea';
Textarea.defaultProps = {
  rows: 3,
};

export default Textarea;
