import React, {
  forwardRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  ReactText,
} from 'react';
import classnames from 'classnames';

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  rtl?: boolean;
  children?: ReactNode | ReactElement<any> | ReactText;
}

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  (props, ref) => {
    const { className, children, rtl, ...attrs } = props;

    const classes = classnames('p-3 overflow-y-auto', className);

    const filteredChildren = React.Children.toArray(children).filter(Boolean);
    const renderedChildren = filteredChildren.map(child => {
      return React.cloneElement(child as ReactElement<any>, {
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

export default ModalBody;
