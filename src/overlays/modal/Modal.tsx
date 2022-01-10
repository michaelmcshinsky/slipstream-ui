import React, {
  useState,
  useEffect,
  forwardRef,
  ReactNode,
} from 'react';
import { default as ReactModal, Styles } from 'react-modal';
import classnames from 'classnames';
import { ModalBody, ModalBodyProps } from './ModalBody';
import { ModalButton, ModalButtonProps } from './ModalButton';
import { ModalFooter, ModalFooterProps } from './ModalFooter';
import { ModalHeader, ModalHeaderProps } from './ModalHeader';

export interface ModalProps {
  bodyClassName?: string;
  border?: boolean;
  children: ReactNode;
  className?: string;
  contentLabel?: string;
  duration?: number;
  isOpen: boolean;
  isStatic?: boolean;
  onOpened?: () => void;
  overlayClassName?: string;
  rtl?: boolean;
  size?: string;
  style?: Styles;
  toggle?: () => void;
}

interface ModalComponent
  extends React.ForwardRefExoticComponent<
    ModalProps & React.RefAttributes<HTMLDivElement>
  > {
  Body: React.ForwardRefExoticComponent<
    ModalBodyProps & React.RefAttributes<HTMLDivElement>
  >;
  Button: React.ForwardRefExoticComponent<
    ModalButtonProps & React.RefAttributes<HTMLButtonElement>
  >;
  Footer: React.ForwardRefExoticComponent<
    ModalFooterProps & React.RefAttributes<HTMLDivElement>
  >;
  Header: React.ForwardRefExoticComponent<
    ModalHeaderProps & React.RefAttributes<HTMLDivElement>
  >;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>((props, ref) => {
  const {
    bodyClassName,
    border,
    children,
    className,
    contentLabel,
    duration,
    isOpen,
    isStatic,
    onOpened,
    overlayClassName,
    rtl,
    size,
    style,
    toggle,
    ...attrs
  } = props;

  const [isMounted, setIsMounted] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(isOpen);

  useEffect(() => {
    document.addEventListener('keydown', (e: any) => handleEsc(e), {
      capture: true,
    });
    return () => {
      document.removeEventListener('keydown', (e: any) => handleEsc(e));
    };
  }, []);

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
    }, duration)
  }
  
  function handleEsc(ev: React.KeyboardEvent<HTMLDocument>) {
    if (isStatic) {
      return;
    }
    if (ev.key === 'Esc' || ev.key === 'Escape') {
      _onRequestClose()
    }
  }

  const classes = classnames(
    'sui--modal',
    'mx-auto my-auto',
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
    className,
  );

  const overlayClasses = classnames(
    'fixed inset-0 flex overflow-y-auto',
    'bg-black bg-opacity-50',
    { 'opacity-0': isClosing },
    `duration-${duration} transition-opacity transform ease-in-out`,
    overlayClassName,
  );

  const bodyClasses = classnames(
    'bg-white border border-solid border-gray-300 rounded',
    bodyClassName,
  );

  const renderedChildren = React.Children.toArray(children)
    .filter(Boolean)
    .map((child: any) => {
      if (
        child?.type?.displayName === 'ModalHeader' ||
        child?.type?.displayName === 'ModalFooter'
      ) {
        return React.cloneElement(child, {
          border,
          toggle: _onRequestClose,
          rtl,
        });
      } else if (child?.type?.displayName?.includes?.('Modal')) {
        return React.cloneElement(child, {
          toggle: _onRequestClose,
          rtl,
        });
      }
      return child;
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
Modal.defaultProps = {
  duration: 500,
}

Modal.Body = ModalBody;
Modal.Button = ModalButton;
Modal.Footer = ModalFooter;
Modal.Header = ModalHeader;

export default Modal;
