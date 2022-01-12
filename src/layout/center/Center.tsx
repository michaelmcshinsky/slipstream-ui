import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface CenterProps {
  children?: ReactNode;
  className?: string;
  tag?: string | any;
}

export const Center = forwardRef<HTMLElement, CenterProps>(
  ({ children, className, tag: Tag, ...props }, ref) => {
    const classes = classNames(
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
