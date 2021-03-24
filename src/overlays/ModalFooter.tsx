import React, {
  forwardRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  ReactText,
} from 'react';
import classnames from 'classnames';

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  onClose?: (e: any) => void;
  rtl?: boolean;
  children?: ReactNode | ReactElement<any> | ReactText;
}

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  (props, ref) => {
    const { className, onClose, children, rtl, ...attrs } = props;

    const classes = classnames(
      'bg-white border-t border-solid border-gray-300 p-3 rounded-b flex items-center',
      { 'flex-row-reverse': rtl },
      className
    );

    const filteredChildren = React.Children.toArray(children).filter(Boolean);
    const renderedChildren = filteredChildren.map(child => {
      return React.cloneElement(child as ReactElement<any>, {
        onClose,
      });
    });

    return (
      <div className={classes} ref={ref} {...attrs}>
        {renderedChildren}
      </div>
    );
  }
);

export default ModalFooter;
