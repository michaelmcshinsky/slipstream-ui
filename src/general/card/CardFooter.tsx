import React, { forwardRef, ReactNode } from 'react';
import classnames from 'classnames';

export interface CardFooterProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  border?: boolean;
  children?: ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  (props, ref) => {
    const { className, size, border, children, ...attributes } = props;
    const classes = classnames(
      'sui--card-footer',
      'text-gray-700 dark:text-gray-300 dark:bg-gray-900 dark:border-gray-500',
      'p-3 rounded-b flex items-center',
      { 'border-t border-solid': border },
      { 'px-3 py-2': size === 'sm' },
      { 'p-3': size === 'md' || !size },
      { 'p-4': size === 'lg' },
      { 'border-gray-300 dark:border-gray-500': border },
      className
    );

    const renderedChildren = React.Children.toArray(children)
      .filter(Boolean)
      .map((child: any) => {
        return React.cloneElement(child, {
          size,
        });
      });

    return (
      <div ref={ref} className={classes} {...attributes}>
        {renderedChildren}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
CardFooter.defaultProps = {
  border: true,
};

export default CardFooter;
