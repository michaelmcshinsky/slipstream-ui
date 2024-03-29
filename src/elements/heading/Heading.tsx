import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type THeading = {
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  custom?: boolean;
  children?: ReactNode;
}

export const Heading = forwardRef<HTMLHeadingElement, THeading>(
  ({ level: Tag, custom, className, children, ...props }, ref) => {
    const classes = clsx(
      'sui--heading',
      !custom && Tag === 'h1' && 'text-3xl',
      !custom && Tag === 'h2' && 'text-2xl',
      !custom && Tag === 'h3' && 'text-xl',
      !custom && Tag === 'h4' && 'text-lg',
      !custom && Tag === 'h5' && 'text-base',
      !custom && Tag === 'h6' && 'text-sm',
      className
    );

    return (
      <Tag ref={ref} className={classes} {...props}>
        {children}
      </Tag>
    );
  }
);

Heading.displayName = 'Heading';
Heading.defaultProps = {
  level: 'h2',
  custom: false,
};

export default Heading;
