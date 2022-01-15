import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import { ListGroupItem, ListGroupItemProps } from './ListGroupItem';

export interface ListGroupProps {
  borderless?: boolean;
  children?: ReactNode;
  className?: string;
  flush?: boolean;
  hover?: boolean;
  numbered?: boolean;
  rtl?: boolean;
  style?: object;
  tag?: any;
}

interface ListGroupComponent
  extends React.ForwardRefExoticComponent<
    ListGroupProps & React.RefAttributes<HTMLElement>
  > {
  Item: React.ForwardRefExoticComponent<
    ListGroupItemProps & React.RefAttributes<HTMLElement>
  >;
}

export const ListGroup = forwardRef<HTMLElement, ListGroupProps>(
  (
    {
      borderless,
      children,
      className,
      flush,
      hover,
      numbered,
      rtl,
      tag: Tag,
      style,
      ...props
    },
    ref
  ) => {
    const classes = classNames(
      'sui--listgroup',
      'flex flex-col list-none p-0',
      ' border divide-y border:border-none after:border-none',
      borderless ? 'divide-transparent' : 'divide-gray-300 dark:divide-gray-500',
      flush ? 'border-t-transparent border-r-0 border-b-transparent border-l-0' : 'border-gray-300 dark:border-gray-500 rounded',
      className
    );

    const styles = { ...style, counterReset: 'section' };

    const renderedChildren = React.Children.toArray(children)
      .filter(Boolean)
      .map((child: any) => {
        if (child?.type?.displayName?.includes?.('ListGroup')) {
          return React.cloneElement(child, {
            flush,
            hover,
            numbered,
            rtl,
          });
        }
        return child;
      });

    return (
      <Tag ref={ref} className={classes} style={styles} {...props}>
        {renderedChildren}
      </Tag>
    );
  }
) as ListGroupComponent;

ListGroup.displayName = 'ListGroup';
ListGroup.Item = ListGroupItem;
ListGroup.defaultProps = {
  borderless: false,
  style: {},
  tag: 'ul',
};

export default ListGroup;
