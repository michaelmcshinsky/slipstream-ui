import React, { ReactNode } from 'react';
import classNames from 'classnames';

export interface TabSetProps {
  vertical?: boolean;
  children?: ReactNode;
  className?: string;
  rtl?: boolean;
  tag: 'nav' | 'ul' | 'div';
  tabs?: string[];
}

export function TabSet({
  children,
  className,
  rtl,
  tabs,
  tag: Tag,
  vertical,
  ...props
}: TabSetProps) {
  const classes = classNames(
    'flex flex-wrap list-none',
    rtl && (vertical ? 'flex-col-reverse' : 'flex-row-reverse'),
    vertical && 'flex-col'
  );

  const renderedChildren = React.Children.toArray(children)
    .filter(Boolean)
    .map((child: any) => {
      if (child?.type?.displayName?.includes('TabItem')) {
        return React.cloneElement(child);
      }
      return React.cloneElement(child);
    });

  return (
    <Tag {...props} className={classes}>
      {renderedChildren}
    </Tag>
  );
}

TabSet.displayName = 'TabSet';
TabSet.defaultProps = {
  tag: 'nav',
  rtl: false,
};
