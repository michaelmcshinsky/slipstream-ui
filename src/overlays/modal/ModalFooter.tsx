import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
} from 'react';
import classnames from 'classnames';

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  border?: boolean;
  children?: ReactNode;
  className?: string;
  toggle?: (e: any) => void;
  rtl?: boolean;
}

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  (props, ref) => {
    const { border, className, toggle, children, rtl, ...attrs } = props;

    const classes = classnames(
      'sui--modal-footer',
      'dark:bg-gray-900 dark:text-gray-300',
      'bg-white p-3 rounded-b flex items-center',
      { 'border-t border-solid border-gray-300': border },
      { 'flex-row-reverse': rtl },
      className,
    );

    const renderedChildren = React.Children.toArray(children)
    .filter(Boolean)
    .map((child: any) => {
      if (child?.type?.displayName?.includes?.('Modal')) {
        return React.cloneElement(child, {
          toggle,
        });
      }
      return child;
    });

    return (
      <div className={classes} ref={ref} {...attrs}>
        {renderedChildren}
      </div>
    );
  },
);

ModalFooter.displayName = 'ModalFooter';

export default ModalFooter;
