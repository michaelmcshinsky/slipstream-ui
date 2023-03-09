import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

import { ChevronDown } from '../../assets/icons/ChevronDown';

export type TDropdownToggle = {
  children?: ReactNode;
  className?: string;
  dataDropdown?: string;
  fill?: string;
  icon?: boolean;
  iconProps?: any;
  rtl?: boolean;
  tag?: any;
};

export const DropdownToggle = forwardRef<HTMLElement, TDropdownToggle>(
  (
    {
      children,
      className,
      dataDropdown,
      fill,
      icon,
      iconProps,
      rtl,
      tag: Tag,
      ...props
    },
    ref
  ) => {
    const classes = clsx(
      'sui--dropdown-toggle flex space-x-2 items-center',
      { 'flex-row-reverse': rtl },
      className
    );

    return (
      <Tag ref={ref} className={classes} {...props}>
        {!!children && <span>{children}</span>}
        {icon && (
          <ChevronDown
            fill={fill}
            data-dropdown={dataDropdown || undefined}
            {...iconProps}
          />
        )}
      </Tag>
    );
  }
);

DropdownToggle.displayName = 'DropdownToggle';
DropdownToggle.defaultProps = {
  tag: 'div',
  fill: '#ffffff',
};

export default DropdownToggle;
