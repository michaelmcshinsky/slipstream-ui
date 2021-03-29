import React, {
  useState,
  useEffect,
  forwardRef,
  ReactElement,
  ReactNode,
  ReactText,
} from 'react';
import { default as ReactModal, Styles } from 'react-modal';
import classnames from 'classnames';
import { ModalBody, ModalBodyProps } from './ModalBody';
import { ModalButton, ModalButtonProps } from './ModalButton';
import { ModalFooter, ModalFooterProps } from './ModalFooter';
import { ModalHeader, ModalHeaderProps } from './ModalHeader';

export interface ModalProps {
  className?: string;
  size?: string;
  contentLabel?: string;
  isStatic?: boolean;
  isOpen: boolean;
  toggle?: () => void;
  onOpened?: () => void;
  children?: ReactNode | ReactElement<any> | ReactText;
  rtl?: boolean;
  style?: Styles;
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
    children,
    size,
    contentLabel,
    isStatic,
    className,
    isOpen,
    toggle,
    onOpened,
    style,
    rtl,
    ...attrs
  } = props;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.addEventListener('keydown', (e: any) => handleEsc(e), {
      capture: true,
    });
    return () => {
      document.removeEventListener('keydown', (e: any) => handleEsc(e));
    };
  });

  function _setMounted() {
    if (onOpened) {
      setMounted(true);
      setTimeout(() => {
        onOpened();
      });
    }
  }

  function onClose() {
    setMounted(false);
    setTimeout(() => {
      if (toggle) {
        toggle();
      }
    }, 500);
  }

  function handleEsc(ev: React.KeyboardEvent<HTMLDocument>) {
    if (isStatic) {
      return;
    }
    if (ev.key === 'Esc' || ev.key === 'Escape') {
      onClose();
    }
  }

  const classes = classnames(
    'relative outline-none focus:outline-none w-full',
    'transform ease-in-out duration-500 mx-auto',
    'flex items-center max-h-full h-full',
    mounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0',
    { 'max-w-xs': size === 'xs' },
    { 'max-w-sm': size === 'sm' },
    { 'max-w-md': size === 'md' },
    { 'max-w-lg': size === 'lg' },
    { 'max-w-xl': (size === 'xl' || !size) && size !== 'full' },
    { 'max-w-2xl': size === '2xl' },
    { 'max-w-3xl': size === '3xl' },
    { 'max-w-4xl': size === '4xl' },
    { 'max-w-5xl': size === '5xl' },
    { ' px-4': size !== 'full' },
    className
  );

  const overlayClasses = classnames(
    'fixed top-0 left-0 w-full h-full outline-none focus:outline-none overflow-x-hidden',
    'w-full duration ease-in-out duration-500 bg-black overflow-y-hidden',
    mounted ? 'bg-opacity-50' : 'bg-opacity-0'
  );

  const bodyClasses = classnames(
    'w-full bg-white border border-solid border-gray-300 rounded flex flex-col',
    'overflow-hidden max-h-full'
  );

  const filteredChildren = React.Children.toArray(children).filter(Boolean);
  const renderedChildren = filteredChildren.map(child => {
    return React.cloneElement(child as ReactElement<any>, {
      onClose,
      rtl,
    });
  });

  return (
    <>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel={contentLabel}
        onAfterOpen={_setMounted}
        className={classes}
        overlayClassName={overlayClasses}
        shouldCloseOnOverlayClick={!isStatic}
        style={style}
        {...attrs}
      >
        <>
          <div className={bodyClasses} ref={ref}>
            {isOpen && renderedChildren}
          </div>
        </>
      </ReactModal>
    </>
  );
}) as ModalComponent;

Modal.Body = ModalBody;
Modal.Button = ModalButton;
Modal.Footer = ModalFooter;
Modal.Header = ModalHeader;

export default Modal;
