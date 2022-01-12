/* eslint-disable import/no-webpack-loader-syntax */
import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
} from 'react';
import classnames from 'classnames';
import { Close } from '../../assets/icons';

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  border?: boolean;
  children?: ReactNode;
  className?: string;
  title?: string;
  rtl?: boolean;
  toggle?: (e: any) => void;
}

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  (props, ref) => {
    const {
      border,
      children,
      className,
      title,
      rtl,
      toggle,
      ...attrs
    } = props;

    function _toggle(e: any) {
      if (toggle) {
        toggle(e);
      }
    }

    const headerClasses = classnames(
      'sui--modal-header',
      'bg-white p-3 rounded-t relative',
      'flex items-center justify-between',
      { 'border-b border-solid border-gray-300': border },
      rtl ? 'flex-row-reverse pl-10' : 'pr-10',
      className,
    );

    const closeClasses = classnames(
      'text-gray-700 bg-transparent p-2 border-none cursor-pointer rounded hover:bg-gray-200 select-none absolute',
      rtl ? 'left-0 ml-2' : 'right-0 mr-2',
    );

    return (
      <div className={headerClasses} ref={ref} {...attrs}>
        <span className="text-xl text-gray-900">{title}</span>
        {children}
        {toggle && (
          <button className={closeClasses} type="button" onClick={_toggle}>
            <Close className="w-4" />
          </button>
        )}
      </div>
    );
  },
);

ModalHeader.displayName = 'ModalHeader';

export default ModalHeader;
