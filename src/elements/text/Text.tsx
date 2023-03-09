import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TText = {
  children?: ReactNode;
  className?: string;
}

export const Text = forwardRef<HTMLParagraphElement, TText>(
  ({ children, className, ...props }, ref) => {
    const classes = clsx('sui--text', className);

    return (
      <p ref={ref} className={classes} {...props}>
        {children}
      </p>
    );
  }
);

Text.displayName = 'Text';

export default Text;
