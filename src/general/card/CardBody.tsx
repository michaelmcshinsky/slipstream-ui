import React, { forwardRef, ReactNode } from 'react';
import classnames from 'classnames';

export interface CardBodyProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
  children?: ReactNode;
}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  (props, ref) => {
    const { className, size, dark, children, ...attributes } = props;
    const classes = classnames(
      { 'px-3 p-2': size === 'sm' },
      { 'p-3': size === 'md' || !size },
      { 'p-4': size === 'lg' },
      { 'text-gray-700': !dark },
      { 'text-gray-200': dark },
      className,
    );

    return (
      <div ref={ref} className={classes} {...attributes}>
        {children}
      </div>
    );
  },
);

export default CardBody;
