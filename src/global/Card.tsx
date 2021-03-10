import React, { forwardRef, ReactNode, ReactElement, ReactText } from 'react';
import classnames from 'classnames';

export interface CardProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
  children?: ReactNode | ReactElement<any> | ReactText;
}

export const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const { className, size, dark, children, ...attributes } = props;
  const classes = classnames(
    'border border-solid rounded w-full',
    { 'border-gray-300': !dark },
    { 'bg-gray-900 border-gray-500': dark },
    className
  );

  const filteredChildren = React.Children.toArray(children).filter(Boolean);
  const renderedChildren = filteredChildren.map(child => {
    return React.cloneElement(child as ReactElement<any>, {
      size,
      dark,
    });
  });

  return (
    <div ref={ref} className={classes} {...attributes}>
      {renderedChildren}
    </div>
  );
});

export default Card;
