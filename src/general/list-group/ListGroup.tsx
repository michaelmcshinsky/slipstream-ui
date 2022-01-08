import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import { ListGroupItem, ListGroupItemProps } from './ListGroupItem';

export interface ListGroupProps {
  children: ReactNode;
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
      className
    );

    const styles = { ...style, counterReset: 'section' };

    const renderedChildren = React.Children.toArray(children)
      .filter(Boolean)
      .map((child: any) => {
        if (child?.type?.displayName?.includes?.('ListGroup')) {
          return React.cloneElement(child, {
            hover,
            flush,
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
  style: {},
  tag: 'ul',
};

export default ListGroup;
