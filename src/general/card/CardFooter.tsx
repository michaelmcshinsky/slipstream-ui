import React, { forwardRef, ReactNode } from 'react';
import classnames from 'classnames';

export interface CardFooterProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
  border?: boolean;
  children?: ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  (props, ref) => {
    const { className, size, dark, border, children, ...attributes } = props;
    const classes = classnames(
      'sui--card-footer',
      'p-3 rounded-b',
      'flex items-center',
      { 'border-t border-solid': border },
      { 'px-3 py-2': size === 'sm' },
      { 'p-3': size === 'md' || !size },
      { 'p-4': size === 'lg' },
      { 'text-gray-700': !dark },
      { 'border-gray-300': !dark && border },
      { 'border-gray-500': dark && border },
      { 'text-gray-200 bg-gray-900 border-gray-500': dark },
      className,
    );

    const renderedChildren = React.Children.toArray(children)
    .filter(Boolean)
    .map((child: any) => {
      return React.cloneElement(child, {
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
CardFooter.defaultProps = {
  border: true,
}

export default CardFooter;
