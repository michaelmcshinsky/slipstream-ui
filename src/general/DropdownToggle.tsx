import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface DropdownToggleProps {
  children?: ReactNode;
  className?: string;
  tag?: any;
}

export const DropdownToggle = forwardRef<HTMLElement, DropdownToggleProps>(
  ({ children, className, tag: Tag, ...props }, ref) => {
    const classes = classNames('sui--dropdown-toggle', className);

    return (
      <Tag ref={ref} className={classes} {...props}>
        {children}
      </Tag>
    );
  }
);

DropdownToggle.displayName = 'DropdownToggle';

DropdownToggle.defaultProps = {
  tag: 'div',
};

export default DropdownToggle;
