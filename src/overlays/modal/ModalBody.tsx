import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import classnames from 'classnames';

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, children, ...props }, ref) => {
    const classes = classnames(
      'sui--modal-body',
      'p-3 dark:bg-gray-900 dark:text-gray-300',
      className
    );

    return (
      <div className={classes} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

ModalBody.displayName = 'ModalBody';

export default ModalBody;
