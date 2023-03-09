import React, { forwardRef, ReactNode, HTMLAttributes } from 'react';
import clsx from 'clsx';

export type TFormFeedback = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  valid?: boolean;
  children?: ReactNode;
}

export const FormFeedback = forwardRef<HTMLDivElement, TFormFeedback>(
  ({ className, valid, children, ...props }, ref) => {
    const classes = clsx(
      'sui--form-feedback text-sm',
      valid ? 'text-green-500' : 'text-red-500',
      className
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

FormFeedback.displayName = 'FormFeedback';

export default FormFeedback;
