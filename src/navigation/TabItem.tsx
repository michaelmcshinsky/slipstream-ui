import React, { ReactNode } from 'react';
import classNames from 'classnames';

export interface TabItemProps {
  active?: boolean;
  children?: ReactNode;
  className?: string;
  custom?: boolean;
  tag: 'li' | 'a' | 'div' | 'input';
  border?: boolean;
  background?: boolean;
}

export function TabItem({
  active,
  children,
  className,
  custom,
  tag,
  border,
  background,
  ...props
}: TabItemProps) {
  const classes = classNames(
    'sui--tab-item',
    'block cursor-pointer leading-none outline-none text-gray-500',
    border && 'border-b-2 border-solid',
    {
      'hover:text-black active:text-black focus:text-black':
        !background && !active,
    },
    {
      'hover:bg-gray-100 active:bg-gray-100 focus:bg-gray-100':
        !active && background,
    },
    {
      'bg-blue-100': active && background,
    },
    active ? 'active border-blue-500 text-blue-500' : 'border-transparent',
    { 'mx-2 py-3': !custom && !background },
    { 'p-3 rounded-md': background },
    { 'rounded-b-none': background && border },
    className
  );

  const Tag = tag;

  return (
    <Tag className={classes} tabIndex={0} {...props}>
      {children}
    </Tag>
  );
}

TabItem.displayName = 'TabItem';
TabItem.defaultProps = {
  tag: 'a',
};
