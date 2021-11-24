import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export interface ButtonGroupProps {
  className?: string;
  flush?: boolean;
  children?: ReactNode;
}

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  (props, ref) => {
    const { className, flush, children, ...attributes } = props;
    const classes = classNames('sui--button-group', { 'space-x-2': !flush }, className);

    const renderedChildren = React.Children.toArray(children)
      .filter(Boolean)
      .map((child: any) => {
        if (child?.type?.displayName?.includes('Button')) {
          return React.cloneElement(child, {
            flush,
          });
        }
        return React.cloneElement(child);
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
