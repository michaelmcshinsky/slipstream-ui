import React, { forwardRef, ReactNode } from 'react';
import classnames from 'classnames';
import { SizeListFull } from '../utils';

export interface ContainerProps {
  htmlFor?: any;
  className?: string;
  size?: SizeListFull;
  fluid?: boolean;
  children?: ReactNode;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (props, ref) => {
    const { className, htmlFor, size, fluid, children, ...attributes } = props;

    const maxWidth = size && `max-w-${size}`;

    const classes = classnames(
      'sui-container px-4 w-full',
      { maxWidth: size && !fluid },
      { 'max-w-6xl': !size && !fluid },
      { 'mx-auto': !fluid },
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
