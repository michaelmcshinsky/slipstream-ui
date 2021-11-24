import React, { ReactNode } from 'react';
import classNames from 'classnames';

export interface TabItemProps {
  active?: boolean;
  background?: boolean;
  border?: boolean;
  children?: ReactNode;
  className?: string;
  tag: 'li' | 'a' | 'div' | 'input';
}

export function TabItem({
  active,
  background,
  border,
  children,
  className,
  tag,
  ...props
}: TabItemProps) {
  const classes = classNames(
    'sui--tab-item',
    'block cursor-pointer leading-none outline-none text-gray-500',
    border && 'border-b-2 border-solid',
    {
      'hover:text-black active:text-black focus:text-black': !active,
    },
    {
      'hover:bg-gray-100 active:bg-gray-100 focus:bg-gray-100':
        !active && background,
    },
    {
      'bg-blue-100': active && background,
    },
    active ? 'active border-blue-500 text-blue-500' : 'border-transparent',
    background ? 'p-3 rounded-md' : 'mx-2 py-3',
    { 'rounded-b-none': background && border },
    className,
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
