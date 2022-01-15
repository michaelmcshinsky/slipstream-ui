import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface TextProps {
  children?: ReactNode;
  className?: string;
  custom?: boolean;
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ children, className, custom, ...props }, ref) => {
    const classes = classNames(
      'sui--text',
      !custom && 'dark:text-gray-300',
      className
    );

    return (
      <p ref={ref} className={classes} {...props}>
        {children}
      </p>
    );
  }
);

Text.displayName = 'Text';

export default Text;
