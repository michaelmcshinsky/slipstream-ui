import React, {
  forwardRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  ReactText,
} from 'react';
import classnames from 'classnames';

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
  children?: ReactNode | ReactElement<any> | ReactText;
  className?: string;
  toggle?: (e: any) => void;
  rtl?: boolean;
}

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  (props, ref) => {
    const { bordered, className, toggle, children, rtl, ...attrs } = props;

    const classes = classnames(
      'bg-white p-3 rounded-b flex items-center',
      { 'border-t border-solid border-gray-300': bordered },
      { 'flex-row-reverse': rtl },
      className
    );

    const filteredChildren = React.Children.toArray(children).filter(Boolean);
    const renderedChildren = filteredChildren.map((child: any) => {
      if (child?.type?.displayName.includes('Modal')) {
        return React.cloneElement(child, {
          toggle,
        });
      }
      return React.cloneElement(child);
    });

    return (
      <div className={classes} ref={ref} {...attrs}>
        {renderedChildren}
      </div>
    );
  }
);

ModalFooter.displayName = 'ModalFooter';

export default ModalFooter;
