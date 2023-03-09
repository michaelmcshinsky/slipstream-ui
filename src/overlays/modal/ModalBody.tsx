import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

export type TModalBody = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  className?: string;
}

export const ModalBody = forwardRef<HTMLDivElement, TModalBody>(
  ({ className, children, ...props }, ref) => {
    const classes = clsx(
      'sui--modal-body p-3',
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
