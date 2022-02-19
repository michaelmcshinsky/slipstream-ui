import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface TabItemProps {
  active?: boolean;
  background?: boolean;
  border?: boolean;
  children?: ReactNode;
  className?: string;
  custom?: boolean;
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
}

export const TabItem = forwardRef<HTMLElement, TabItemProps>(
  (
    {
      active,
      background,
      border,
      children,
      className,
      color,
      custom,
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

    const classes = classNames(
      'sui--tab-item',
      !custom && [
        size === 'xs' && 'p-1 text-xs',
        size === 'sm' && 'p-2 text-sm',
        size === 'md' && 'p-3',
        size === 'lg' && 'p-4 text-lg',
        !active &&
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
        {
          'hover:bg-gray-100 active:bg-gray-100 focus:bg-gray-100':
            !active && background,
        },
        {
          'bg-blue-100': active && background,
        },
        active ? 'border-blue-500 text-blue-500' : 'border-transparent',
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
