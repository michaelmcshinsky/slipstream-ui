import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TTabItem = {
  active?: boolean;
  background?: boolean;
  border?: boolean;
  children?: ReactNode;
  className?: string;
  custom?: boolean;
  invalid?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  tag?: 'li' | 'a' | 'div' | 'input' | any;
  color?: string;
  onClick?: (value: any) => void;
  shade?:
    | '50'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | string
    | number;
  value?: any;
  vertical?: boolean;
};

export const TabItem = forwardRef<HTMLElement, TTabItem>(
  (
    {
      active,
      background,
      border,
      children,
      className,
      color,
      custom,
      invalid,
      onClick,
      shade,
      size,
      tag,
      value,
      vertical,
      ...props
    },
    ref
  ) => {
    function _handleClick(e: Event) {
      if (onClick) {
        onClick(value ?? e);
      }
    }

    const classes = clsx(
      'sui--tab-item',
      !custom && [
        size === 'xs' && 'p-1 text-xs',
        size === 'sm' && 'p-2 text-sm',
        size === 'md' && 'p-3',
        size === 'lg' && 'p-4 text-lg',
        invalid
          ? 'text-red-500 hover:text-red-800 focus:text-red-800 active:text-red-800'
          : !active &&
            (color
              ? `text-${color}${
                  color === 'black' || color === 'white' ? '' : `-${shade}`
                }`
              : 'text-gray-500'),
        'block cursor-pointer leading-none outline-none',
        border && 'border-b-2 border-solid',
        {
          'hover:text-black active:text-black focus:text-black': !active,
        },
        background && [
          {
            'bg-red-100 hover:bg-red-200 active:bg-red-200 focus:bg-red-200': invalid,
          },
          {
            'bg-blue-100 hover:bg-blue-200 active:bg-blue-200 focus:bg-blue-200':
              active && !invalid,
          },
          {
            'hover:bg-gray-100 active:bg-gray-100 focus:bg-gray-100':
              !active && !invalid,
          },
        ],
        active
          ? invalid
            ? 'border-red-500 text-red-500'
            : 'border-blue-500 text-blue-500'
          : 'border-transparent',
        background
          ? vertical && border
            ? ''
            : vertical
            ? 'rounded-md'
            : 'rounded-md'
          : '',
        { 'rounded-b-none': background && border },
      ],
      active && 'active',
      className
    );

    const Tag = tag;

    return (
      <Tag
        ref={ref}
        className={classes}
        tabIndex={0}
        onClick={_handleClick}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

TabItem.displayName = 'TabItem';
TabItem.defaultProps = {
  size: 'md',
  tag: 'a',
};

export default TabItem;
