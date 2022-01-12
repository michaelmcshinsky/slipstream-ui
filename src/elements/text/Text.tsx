import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface TextProps {
  children?: ReactNode;
  className?: string;
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ children, className, ...props }, ref) => {
    const classes = classNames('sui--text', className);

    return (
      <p ref={ref} className={classes} {...props}>
        {children}
      </p>
    );
  }
);

Text.displayName = 'Text';

export default Text;
