import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import classnames from 'classnames';

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  rtl?: boolean;
  toggle?: boolean;
}

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, children, rtl, toggle, ...attrs }, ref) => {
    const classes = classnames(
      'sui--modal-body',
      'p-3 dark:bg-gray-900 dark:text-gray-300',
      className
    );

    const renderedChildren = React.Children.toArray(children)
      .filter(Boolean)
      .map((child: any) => {
        return React.cloneElement(child, {
          rtl,
        });
      });

    return (
      <div className={classes} ref={ref} {...attrs}>
        {renderedChildren}
      </div>
    );
  }
);

ModalBody.displayName = 'ModalBody';

export default ModalBody;
