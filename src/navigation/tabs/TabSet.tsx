import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import { TabItem, TabItemProps } from './TabItem';

export interface TabSetProps {
  background?: boolean;
  border?: boolean;
  children?: ReactNode;
  className?: string;
  rtl?: boolean;
  tabs?: TabItemMappedProps[];
  tag?: 'nav' | 'ul' | 'div' | any;
  vertical?: boolean;
  custom?: boolean;
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
      background,
      border,
      children,
      className,
      rtl,
      tabs,
      tag: Tag,
      vertical,
      custom,
      ...props
    },
    ref
  ) => {
    const classes = classNames(
      'sui--tab-set',
      'flex flex-wrap list-none',
      rtl && (vertical ? 'flex-col-reverse' : 'flex-row-reverse'),
      vertical && 'flex-col',
      className
    );

    const renderedChildren = React.Children.toArray(children)
      .filter(Boolean)
      .map((child: any) => {
        if (child?.type?.displayName?.includes('TabItem')) {
          return React.cloneElement(child, {
            border,
            background,
            custom,
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
  tag: 'nav',
  rtl: false,
};
TabSet.Item = TabItem;

export default TabSet;
