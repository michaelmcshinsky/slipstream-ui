import React, { forwardRef, ReactNode } from 'react';

export interface DropdownToggleProps {
  children?: ReactNode;
  className?: string;
  tag?: any;
}

export const DropdownToggle = forwardRef<HTMLElement, DropdownToggleProps>(
  ({ children, tag: Tag, ...props }, ref) => {
    return (
      <Tag ref={ref} {...props}>
        {children}
      </Tag>
    );
  }
);

DropdownToggle.displayName = 'DropdownToggle';

DropdownToggle.defaultProps = {
  tag: 'div',
};
