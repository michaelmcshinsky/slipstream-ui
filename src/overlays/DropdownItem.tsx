import React, { ReactNode } from 'react';

export interface DropdownItemProps {
  children?: ReactNode;
  tag?: any;
}

export function DropdownItem({ children, tag: Tag }: DropdownItemProps) {
  return <Tag className="px-2 py-1 leading-tight">{children}</Tag>;
}

DropdownItem.defaultProps = {
  tag: 'div',
};
