import React, { forwardRef } from 'react';
import { Input, InputProps } from '../input/Input';

export interface TextareaProps extends InputProps {
  rows?: string | number;
}

export const Textarea = forwardRef<HTMLInputElement, TextareaProps>(
  (props, ref) => {
    return <Input ref={ref} {...props} tag="textarea" />;
  }
);

Textarea.displayName = 'Textarea';
Textarea.defaultProps = {
  rows: 3,
};

export default Textarea;
