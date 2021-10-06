import React, { ReactNode } from 'react';
import classNames from 'classnames';

export interface TabItemProps {
  active?: boolean;
  animated?: boolean;
  children?: ReactNode;
  className?: string;
  custom?: boolean;
  tag: 'li' | 'a' | 'div' | 'input';
}

export function TabItem({
  active,
  animated,
  children,
  className,
  custom,
  tag,
  ...props
}: TabItemProps) {
  const classes = classNames(
    'block cursor-pointer leading-none',
    active && 'active',
    !custom && 'p-2',
    className
  );

  const Tag = animated ? 'input' : tag;

  return (
    <Tag {...props} className={classes}>
      {children}
    </Tag>
  );
}

TabItem.defaultProps = {
  tag: 'a',
  animated: false,
};
