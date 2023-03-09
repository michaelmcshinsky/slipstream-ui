/* eslint-disable import/no-webpack-loader-syntax */
import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { Close } from '../../assets/icons';

export type TModalHeader = HTMLAttributes<HTMLDivElement> & {
  border?: boolean;
  children?: ReactNode;
  className?: string;
  title?: string;
  rtl?: boolean;
  toggle?: (e: any) => void;
}

export const ModalHeader = forwardRef<HTMLDivElement, TModalHeader>(
  (props, ref) => {
    const { border, children, className, title, rtl, toggle, ...attrs } = props;

    function _toggle(e: any) {
      if (toggle) {
        toggle(e);
      }
    }

    const headerClasses = clsx(
      'sui--modal-header',
      'bg-white p-3 rounded-t relative',
      'flex items-center justify-between',
      { 'border-b border-solid border-gray-300': border },
      rtl ? 'flex-row-reverse pl-10' : 'pr-10',
      className
    );

    const closeClasses = clsx(
      'text-gray-700 bg-transparent p-2 border-none cursor-pointer rounded select-none absolute',
      'hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-200',
      rtl ? 'left-0 ml-2' : 'right-0 mr-2'
    );

    return (
      <div className={headerClasses} ref={ref} {...attrs}>
        <div className="flex flex-wrap items-center text-xl text-gray-900">
          <span className="sui--modal-header_title">{title}</span>
          {children}
        </div>
        {toggle && (
          <button type="button" className={closeClasses} onClick={_toggle}>
            <Close className="w-4" />
          </button>
        )}
      </div>
    );
  }
);

ModalHeader.displayName = 'ModalHeader';

export default ModalHeader;
