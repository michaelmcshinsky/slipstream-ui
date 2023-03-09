import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TListGroupItem = {
  active?: boolean;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  flush?: boolean;
  hover?: boolean;
  numbered?: boolean;
  tag?: any;
  rtl?: boolean;
}

export const ListGroupItem = forwardRef<HTMLElement, TListGroupItem>(
  (
    {
      active,
      children,
      className,
      disabled,
      flush,
      hover,
      numbered,
      tag: Tag,
      rtl,
      ...props
    },
    ref
  ) => {
    const classes = clsx(
      'sui--listgroup-item',
      'flex relative px-4 py-3 -mb-px last:mb-0',
      { 'first:rounded-t-sm last:rounded-b-sm': !flush },
      active
        ? [
            'active bg-blue-500 text-white cursor-pointer',
          ]
          : 'bg-white',
      {
        'hover:bg-gray-200 cursor-pointer':
          hover && !active && !disabled,
      },
      { 'text-gray-400 cursor-not-allowed': disabled },
      { 'text-left': Tag === 'button' },
      { 'align-start numbered': numbered },
      { 'flex-row-reverse': rtl },
      className
    );

    return (
      <Tag ref={ref} className={classes} {...props}>
        {children}
      </Tag>
    );
  }
);

ListGroupItem.displayName = 'ListGroupItem';
ListGroupItem.defaultProps = {
  tag: 'li',
};

export default ListGroupItem;
