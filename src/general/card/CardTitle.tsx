import React, { forwardRef, ReactNode } from 'react';
import classnames from 'classnames';

export interface CardTitleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
  children?: ReactNode;
}

export const CardTitle = forwardRef<HTMLDivElement, CardTitleProps>(
  (props, ref) => {
    const { className, size, dark, children, ...attributes } = props;
    const classes = classnames(
      'sui--card-title leading-tight',
      { 'text-base': size === 'sm' },
      { 'text-lg': size === 'md' || !size },
      { 'text-xl': size === 'lg' },
      { 'text-gray-700': !dark },
      { 'text-gray-200': dark },
      className,
    );

    return (
      <h3 ref={ref} className={classes} {...attributes}>
        {children}
      </h3>
    );
  },
);

CardTitle.displayName = 'CardTitle';

export default CardTitle;
