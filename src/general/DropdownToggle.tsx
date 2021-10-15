import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

import { ChevronDown } from '../assets/icons';

export interface DropdownToggleProps {
  children?: ReactNode;
  className?: string;
  tag?: any;
  icon?: boolean;
  rtl?: boolean;
}

export const DropdownToggle = forwardRef<HTMLElement, DropdownToggleProps>(
  ({ children, className, tag: Tag, icon, rtl, ...props }, ref) => {
    const classes = classNames(
      'sui--dropdown-toggle flex items-center',
      { 'flex-row-reverse': rtl },
      className
    );

    const iconClasses = classNames(rtl ? 'pr-2' : 'pl-2');

    return (
      <Tag ref={ref} className={classes} {...props}>
        {children}
        {icon && <ChevronDown className={iconClasses} fill="#fff" />}
      </Tag>
    );
  }
);

DropdownToggle.displayName = 'DropdownToggle';

DropdownToggle.defaultProps = {
  tag: 'div',
};

export default DropdownToggle;
