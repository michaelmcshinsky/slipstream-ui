import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TCenter = {
  children?: ReactNode;
  className?: string;
  tag?: string | any;
}

export const Center = forwardRef<HTMLElement, TCenter>(
  ({ children, className, tag: Tag, ...props }, ref) => {
    const classes = clsx(
      'sui--center',
      'flex items-center justify-center',
      className
    );

    return (
      <Tag ref={ref} className={classes} {...props}>
        {children}
      </Tag>
    );
  }
);

Center.displayName = 'Center';
Center.defaultProps = {
  tag: 'div',
};

export default Center;
