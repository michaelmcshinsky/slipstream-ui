import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import { TabItem, TabItemProps } from './TabItem';

export interface TabSetProps {
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

interface TabItemMappedProps extends TabItemProps {
  key?: string;
}

interface TabSetComponent
  extends React.ForwardRefExoticComponent<
    TabSetProps & React.RefAttributes<HTMLElement>
  > {
  Item: React.ForwardRefExoticComponent<
    TabItemProps & React.RefAttributes<HTMLElement>
  >;
}

export const TabSet = forwardRef<HTMLElement, TabSetProps>(
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

    const classes = classNames(
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
