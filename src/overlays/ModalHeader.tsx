/* eslint-disable import/no-webpack-loader-syntax */
import React, { forwardRef, HTMLAttributes } from 'react';
import classnames from 'classnames';

import Close from '-!svg-react-loader!../assets/icons/close.svg';

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  title?: string;
  rtl?: boolean;
  onClose?: (e: any) => void;
}

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  (props, ref) => {
    const { className, title, rtl, onClose, ...attrs } = props;

    function _onClose(e: any) {
      if (onClose) {
        onClose(e);
      }
    }

    const headerClasses = classnames(
      'bg-white p-3 rounded-t border-b border-solid border-gray-300 relative',
      'flex items-center justify-between',
      rtl ? 'flex-row-reverse pl-10' : 'pr-10',
      className
    );

    const closeClasses = classnames(
      'text-gray-700 bg-transparent p-2 border-none cursor-pointer rounded hover:bg-gray-200 select-none absolute',
      rtl ? 'left-0 ml-2' : 'right-0 mr-2'
    );

    return (
      <div className={headerClasses} ref={ref} {...attrs}>
        <span className="text-xl text-gray-900">{title}</span>
        {onClose && (
          <button className={closeClasses} type="button" onClick={_onClose}>
            <Close className="w-4" />
          </button>
        )}
      </div>
    );
  }
);

export default ModalHeader;
