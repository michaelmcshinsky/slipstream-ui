import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import { TSizeFull } from '../../utils';

export type TContainer = {
  className?: string;
  size?: TSizeFull;
  fluid?: boolean;
  children?: ReactNode;
};

export const Container = forwardRef<HTMLDivElement, TContainer>(
  (props, ref) => {
    const { className, size, fluid, children, ...attributes } = props;

    const maxTWidth = size && `max-w-${size}`;

    const classes = clsx(
      'sui--container px-4 w-full',
      { 'max-w-6xl': !size && !fluid },
      { 'mx-auto': !fluid },
      maxTWidth,
      className
    );

    return (
      <div ref={ref} className={classes} {...attributes}>
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';
Container.defaultProps = {
  size: '6xl',
};

export default Container;
