import React, { ReactNode, forwardRef } from 'react';
import clsx from 'clsx';

export type TDropdownItem = {
  children?: ReactNode;
  className?: string;
  tag?: any;
};

export const DropdownItem = forwardRef<HTMLElement, TDropdownItem>(
  ({ children, className, tag: Tag, ...props }, ref) => {
    const classes = clsx(
      'sui--dropdown-item',
      'px-2 py-1 leading-tight',
      className
    );

    return (
      <Tag ref={ref} className={classes} {...props}>
        {children}
      </Tag>
    );
  }
);

DropdownItem.displayName = 'DropdownItem';
DropdownItem.defaultProps = {
  tag: 'div',
};

export default DropdownItem;
