import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface ListGroupItemProps {
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

export const ListGroupItem = forwardRef<HTMLElement, ListGroupItemProps>(
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
    const classes = classNames(
      'sui--listgroup-item',
      'relative px-4 py-3 -mb-px last:mb-0',
      'border border-solid flex',
      { 'first:rounded-t last:rounded-b': !flush },
      active
        ? 'active bg-blue-500 text-white border-blue-500 cursor-pointer'
        : 'bg-white border-gray-300',
      { 'hover:bg-gray-200 cursor-pointer': hover && !active && !disabled },
      { 'text-gray-400 cursor-not-allowed': disabled },
      { 'border-r-0 border-l-0 first:border-t-0 last:border-b-0': flush },
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
