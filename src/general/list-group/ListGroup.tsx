import React, { forwardRef, ReactElement, ReactNode } from 'react';
import classNames from 'classnames';

export interface ListGroupProps {
  children?: ReactNode;
  className?: string;
  flush?: boolean;
  hover?: boolean;
  numbered?: boolean;
  rtl?: boolean;
  style?: object;
  tag?: any;
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
    ref,
  ) => {
    const classes = classNames(
      'sui--listgroup',
      'flex flex-col list-none p-0',
      className,
    );

    const styles = { ...style, counterReset: 'section' };

    const filteredChildren = React.Children.toArray(children).filter(Boolean);
    const renderedChildren = filteredChildren.map((child) => {
      return React.cloneElement(child as ReactElement<any>, {
        hover,
        flush,
        numbered,
        rtl,
      });
    });

    return (
      <Tag ref={ref} className={classes} style={styles} {...props}>
        {renderedChildren}
      </Tag>
    );
  },
);

ListGroup.displayName = 'ListGroup';
ListGroup.defaultProps = {
  style: {},
  tag: 'ul',
};

export default ListGroup;
