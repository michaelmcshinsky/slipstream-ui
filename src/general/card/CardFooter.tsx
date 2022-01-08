import React, { forwardRef, ReactElement, ReactNode, ReactText } from 'react';
import classnames from 'classnames';

export interface CardFooterProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
  children: ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  (props, ref) => {
    const { className, size, dark, children, ...attributes } = props;
    const classes = classnames(
      'p-3 border-t border-solid rounded-b',
      'flex items-center',
      { 'px-3 py-2': size === 'sm' },
      { 'p-3': size === 'md' || !size },
      { 'p-4': size === 'lg' },
      { 'text-gray-700 border-gray-300': !dark },
      { 'text-gray-200 bg-gray-900 border-gray-500': dark },
      className,
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
  },
);

CardFooter.displayName = 'CardFooter';

export default CardFooter;
