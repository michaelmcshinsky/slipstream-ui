import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
} from 'react';
import clsx from 'clsx';

export type TModalFooter = HTMLAttributes<HTMLDivElement> & {
  border?: boolean;
  children?: ReactNode;
  className?: string;
  toggle?: (e: any) => void;
  rtl?: boolean;
}

export const ModalFooter = forwardRef<HTMLDivElement, TModalFooter>(
  (props, ref) => {
    const { border, className, toggle, children, rtl, ...attrs } = props;

    const classes = clsx(
      'sui--modal-footer',
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
