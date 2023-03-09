import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import { TabItem, TTabItem } from './TabItem';

export type TTabSet = {
  active?: any;
  background?: boolean;
  border?: boolean;
  children?: ReactNode;
  className?: string;
  custom?: boolean;
  onClick?: (value: any) => void;
  rtl?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  tabs?: TabItemMappedProps[];
  tag?: 'nav' | 'ul' | 'div' | any;
  vertical?: boolean;
}

type TabItemMappedProps = TTabItem & {
  key?: string;
}

type TabSetComponent
  = React.ForwardRefExoticComponent<
    TTabSet & React.RefAttributes<HTMLElement>
  > & {
  Item: React.ForwardRefExoticComponent<
    TTabItem & React.RefAttributes<HTMLElement>
  >;
}

export const TabSet = forwardRef<HTMLElement, TTabSet>(
  (
    {
      active,
      background,
      border,
      children,
      className,
      custom,
      onClick,
      rtl,
      tabs,
      vertical,
      size,
      tag: Tag,
      ...props
    },
    ref
  ) => {
    function _handleClick(value: any) {
      if (onClick) {
        onClick(value);
      }
    }

    const classes = clsx(
      'sui--tab-set',
      'flex flex-wrap list-none',
      rtl && (vertical ? 'flex-col-reverse' : 'flex-row-reverse'),
      { 'flex-col ': vertical },
      className
    );

    const renderedChildren = React.Children.toArray(children)
      .filter(Boolean)
      .map((child: any) => {
        if (child?.type?.displayName?.includes('TabItem')) {
          const activeTab = child.props.active
            ? child.props.active
            : active !== undefined && child.props.value !== undefined
            ? active === child.props.value
              ? true
              : undefined
            : undefined;
          return React.cloneElement(child, {
            active: activeTab,
            border,
            background,
            custom,
            onClick: _handleClick,
            size,
            vertical,
          });
        }
        return child;
      });

    return (
      <Tag ref={ref} className={classes} {...props}>
        {tabs?.map(({ key, ...tab }: TabItemMappedProps) => (
          <TabItem key={key} {...tab} />
        ))}
        {renderedChildren}
      </Tag>
    );
  }
) as TabSetComponent;

TabSet.displayName = 'TabSet';
TabSet.defaultProps = {
  size: 'md',
  tag: 'nav',
  rtl: false,
};
TabSet.Item = TabItem;

export default TabSet;
