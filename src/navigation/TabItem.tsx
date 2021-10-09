import React, { ReactNode } from 'react';
import classNames from 'classnames';

export interface TabItemProps {
  active?: boolean;
  children?: ReactNode;
  className?: string;
  custom?: boolean;
  tag: 'li' | 'a' | 'div' | 'input';
}

export function TabItem({
  active,
  children,
  className,
  custom,
  tag,
  ...props
}: TabItemProps) {
  const classes = classNames(
    'block cursor-pointer leading-none outline-none',
    'border-b-2 border-solid',
    'hover:bg-gray-100 active:bg-gray-100 focus:bg-gray-100',
    !active && 'hover:border-gray-500 active:border-gray-500 focus:border-gray-500',
    active ? 'active border-blue-500' : 'border-transparent',
    !custom && 'p-2',
    className
  );

  const Tag = tag;

  return (
    <Tag {...props} className={classes} tabIndex={0}>
      {children}
    </Tag>
  );
}

TabItem.displayName = 'TabItem';
TabItem.defaultProps = {
  tag: 'a',
};
