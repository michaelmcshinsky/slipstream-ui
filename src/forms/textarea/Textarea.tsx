import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { Input, InputProps } from '../input/Input';

export interface TextareaProps extends InputProps {
  rows?: string | number;
  className?: string;
}

export const Textarea = forwardRef<HTMLInputElement, TextareaProps>(
  ({className, ...props}, ref) => {
    const classes = classNames('sui--textarea', className)
    return <Input ref={ref} className={classes} {...props} tag="textarea" />;
  },
);

Textarea.displayName = 'Textarea';
Textarea.defaultProps = {
  rows: 3,
};

export default Textarea;
