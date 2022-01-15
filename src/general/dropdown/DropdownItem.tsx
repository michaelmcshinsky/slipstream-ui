import React, { ReactNode, forwardRef } from 'react';
import classNames from 'classnames';

export interface DropdownItemProps {
  children?: ReactNode;
  className?: string;
  tag?: any;
}

export const DropdownItem = forwardRef<HTMLElement, DropdownItemProps>(
  ({ children, className, tag: Tag, ...props }, ref) => {
    const classes = classNames(
      'sui--dropdown-item',
      'px-2 py-1 leading-tight',
      'dark:text-gray-300 dark:hover:text-white',
      className
    )

    return (
      <Tag ref={ref} className={classes} {...props}>
        {children}
      </Tag>
    );
  },
);

DropdownItem.displayName = 'DropdownItem';
DropdownItem.defaultProps = {
  tag: 'div',
};

export default DropdownItem;