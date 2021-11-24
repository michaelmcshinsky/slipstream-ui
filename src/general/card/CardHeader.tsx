import React, { forwardRef, ReactElement, ReactNode, ReactText } from 'react';
import classnames from 'classnames';

export interface CardHeaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
  children?: ReactNode | ReactElement<any> | ReactText;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  (props, ref) => {
    const { className, size, dark, children, ...attributes } = props;
    const classes = classnames(
      'p-3 border-b border-solid rounded-t',
      'flex items-center',
      { 'px-3 py-2': size === 'sm' },
      { 'p-3': size === 'md' || !size },
      { 'p-4': size === 'lg' },
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
  }
);

export default CardHeader;
