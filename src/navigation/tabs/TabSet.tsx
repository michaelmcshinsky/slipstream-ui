import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { TabItem, TabItemProps } from './TabItem';

export interface TabSetProps {
  background?: boolean;
  border?: boolean;
  children?: ReactNode;
  className?: string;
  rtl?: boolean;
  tabs?: TabItemMappedProps[];
  tag: 'nav' | 'ul' | 'div';
  vertical?: boolean;
}

interface TabItemMappedProps extends TabItemProps {
  key?: string;
}

export function TabSet({
  background,
  border,
  children,
  className,
  rtl,
  tabs,
  tag: Tag,
  vertical,
  ...props
}: TabSetProps) {
  const classes = classNames(
    'sui--tab-set',
    'flex flex-wrap list-none',
    rtl && (vertical ? 'flex-col-reverse' : 'flex-row-reverse'),
    vertical && 'flex-col',
  );

  const renderedChildren = React.Children.toArray(children)
    .filter(Boolean)
    .map((child: any) => {
      if (child?.type?.displayName?.includes('TabItem')) {
        return React.cloneElement(child, { border, background });
      }
      return React.cloneElement(child);
    });

  return (
    <Tag {...props} className={classes}>
      {tabs?.map(({ key, ...tab }: TabItemMappedProps) => (
        <TabItem key={key} {...tab} />
      ))}
      {renderedChildren}
    </Tag>
  );
}

TabSet.displayName = 'TabSet';
TabSet.defaultProps = {
  tag: 'nav',
  rtl: false,
};
