import React, { forwardRef, ReactNode } from 'react';
import classnames from 'classnames';

export interface ContainerProps {
  htmlFor?: any;
  className?: string;
  size?: string;
  fluid?: boolean;
  children?: ReactNode;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (props, ref) => {
    const { className, htmlFor, size, fluid, children, ...attributes } = props;

    const maxWidth = `max-w-${size}`;

    const classes = classnames(
      { maxWidth: size && !fluid },
      { 'max-w-6xl': !size && !fluid },
      fluid ? 'w-full' : 'mx-auto w-full',
      maxWidth,
      className
    );

    return (
      <div ref={ref} className={classes} {...attributes}>
        {children}
      </div>
    );
  }
);

export default Container;
