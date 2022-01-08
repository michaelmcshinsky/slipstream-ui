import React, {
  forwardRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  ReactText,
} from 'react';
import classnames from 'classnames';

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode | ReactElement<any> | ReactText;
  className?: string;
  rtl?: boolean;
  toggle?: boolean;
}

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, children, rtl, toggle, ...attrs }, ref) => {
    const classes = classnames('sui--modal-body p-3', className);
    
    const filteredChildren = React.Children.toArray(children).filter(Boolean);
    const renderedChildren = filteredChildren.map((child) => {
      return React.cloneElement(child as ReactElement<any>, {
        rtl,
      });
    });

    return (
      <div className={classes} ref={ref} {...attrs}>
        {renderedChildren}
      </div>
    );
  },
);

ModalBody.displayName = 'ModalBody';

export default ModalBody;
