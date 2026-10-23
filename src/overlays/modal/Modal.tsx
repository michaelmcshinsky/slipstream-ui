import React, { useState, useEffect, forwardRef, ReactNode } from 'react';
import { default as ReactModal, Styles } from 'react-modal';
import clsx from 'clsx';
import { ModalBody, TModalBody } from './ModalBody';
import { ModalButton, TModalButton } from './ModalButton';
import { ModalFooter, TModalFooter } from './ModalFooter';
import { ModalHeader, TModalHeader } from './ModalHeader';

export type TModal = {
  bodyClassName?: string;
  border?: boolean;
  children?: ReactNode;
  className?: string;
  contentLabel?: string;
  duration?: number;
  isOpen: boolean;
  isStatic?: boolean;
  overlayClassName?: string;
  rtl?: boolean;
  size?: string;
  style?: Styles;
  toggle?: () => void;
}

type ModalComponent
  = React.ForwardRefExoticComponent<
    TModal & React.RefAttributes<HTMLDivElement>
  > & {
  Body: React.ForwardRefExoticComponent<
    TModalBody & React.RefAttributes<HTMLDivElement>
  >;
  Button: React.ForwardRefExoticComponent<
    TModalButton & React.RefAttributes<HTMLButtonElement>
  >;
  Footer: React.ForwardRefExoticComponent<
    TModalFooter & React.RefAttributes<HTMLDivElement>
  >;
  Header: React.ForwardRefExoticComponent<
    TModalHeader & React.RefAttributes<HTMLDivElement>
  >;
}

export const Modal = forwardRef<HTMLDivElement, TModal>((props, ref) => {
  const {
    bodyClassName,
    border,
    children,
    className,
    contentLabel,
    duration = 500,
    isOpen,
    isStatic,
    overlayClassName,
    rtl,
    size,
    style,
    toggle,
    ...attrs
  } = props;

  const [isMounted, setIsMounted] = useState(!!isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => handleEsc(e);
    document.addEventListener('keydown', onKeyDown, {
      capture: true,
    });
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isStatic, duration, toggle]);

  function _onAfterOpen() {
    setIsMounted(true);
  }

  function _onAfterClose() {
    setIsMounted(false);
  }

  function _onRequestClose() {
    setIsClosing(true);
    setTimeout(() => {
      if (toggle) {
        toggle();
      }
      setIsClosing(false);
    }, duration);
  }

  function handleEsc(ev: KeyboardEvent) {
    if (isStatic) {
      return;
    }
    if (ev.key === 'Esc' || ev.key === 'Escape') {
      _onRequestClose();
    }
  }

  const classes = clsx(
    'sui--modal',
    'mx-auto my-auto w-full',
    { 'max-w-xs': size === 'xs' },
    { 'max-w-sm': size === 'sm' },
    { 'max-w-md': size === 'md' },
    { 'max-w-lg': size === 'lg' },
    { 'max-w-xl': (size === 'xl' || !size) && size !== 'full' },
    { 'max-w-2xl': size === '2xl' },
    { 'max-w-3xl': size === '3xl' },
    { 'max-w-4xl': size === '4xl' },
    { 'max-w-5xl': size === '5xl' },
    { 'px-4': size !== 'full' },
    'outline-none',
    className
  );

  const overlayClasses = clsx(
    'fixed inset-0 flex overflow-y-auto',
    'bg-black bg-opacity-50',
    { 'opacity-0': isClosing },
    `duration-${duration} transition-opacity transform ease-in-out`,
    overlayClassName
  );

  const bodyClasses = clsx(
    'bg-white border border-solid border-gray-300 rounded',
    bodyClassName
  );

  const renderedChildren = React.Children.toArray(children)
    .filter(Boolean)
    .map((child) => {
      if (!React.isValidElement(child)) return child;
      const elementType = child.type as { displayName?: string } | string;
      const displayName =
        typeof elementType === 'string' ? undefined : elementType?.displayName;
      const childProps = child.props as { close?: boolean };
      switch (displayName) {
        case 'ModalHeader':
        case 'ModalFooter':
          return React.cloneElement(child, {
            border,
            toggle: _onRequestClose,
            rtl,
          } as Partial<unknown>);
        case 'ModalButton':
          if (childProps.close) {
            return React.cloneElement(child, {
              toggle: _onRequestClose,
            } as Partial<unknown>);
          }
          return child;
        default:
          return child;
      }
    });

  return (
    <>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={_onRequestClose}
        contentLabel={contentLabel}
        onAfterOpen={_onAfterOpen}
        onAfterClose={_onAfterClose}
        className={classes}
        overlayClassName={overlayClasses}
        shouldCloseOnOverlayClick={!isStatic}
        ariaHideApp={false}
        style={style}
        {...attrs}
      >
        <div className={bodyClasses} ref={ref}>
          {isMounted && renderedChildren}
        </div>
      </ReactModal>
    </>
  );
}) as ModalComponent;

Modal.displayName = 'Modal';

Modal.Body = ModalBody;
Modal.Button = ModalButton;
Modal.Footer = ModalFooter;
Modal.Header = ModalHeader;

export default Modal;
