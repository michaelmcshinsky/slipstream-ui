import React, { ReactNode, forwardRef } from 'react';

export interface DropdownItemProps {
  children?: ReactNode;
  tag?: any;
}

export const DropdownItem = forwardRef<HTMLElement, DropdownItemProps>(
  ({ children, tag: Tag, ...props }, ref) => {
    return (
      <Tag ref={ref} className="sui--dropdown-item px-2 py-1 leading-tight" {...props}>
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