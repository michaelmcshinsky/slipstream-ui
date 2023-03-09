import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export type TButtonGroup = {
  className?: string;
  flush?: boolean;
  children?: ReactNode;
}

export const ButtonGroup = forwardRef<HTMLDivElement, TButtonGroup>(
  (props, ref) => {
    const { className, flush, children, ...attributes } = props;
    const classes = clsx('sui--button-group', { 'space-x-2': !flush }, className);

    const renderedChildren = React.Children.toArray(children)
      .filter(Boolean)
      .map((child: any) => {
        if (child?.type?.displayName?.includes('Button')) {
          return React.cloneElement(child, {
            flush,
          });
        }
        return child;
      });

    return (
      <div ref={ref} className={classes} {...attributes}>
        {renderedChildren}
      </div>
    );
  },
);

ButtonGroup.displayName = 'ButtonGroup';
ButtonGroup.defaultProps = {
  flush: false,
};

export default ButtonGroup;
