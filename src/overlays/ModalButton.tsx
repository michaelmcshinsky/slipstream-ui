import React, { forwardRef, ReactNode } from 'react';
import { Button, ButtonProps } from '../';

interface Callback {
  (): void;
}

export interface ModalButtonProps extends ButtonProps {
  children?: ReactNode;
  close?: boolean;
  onClick?: (
    e: React.MouseEventHandler<HTMLButtonElement>,
    callback: Callback
  ) => void;
  onClose?: Callback;
}

export const ModalButton = forwardRef<HTMLButtonElement, ModalButtonProps>(
  (props, ref) => {
    const { children, close, onClick, onClose, type, ...attrs } = props;

    function _onClose(e: React.MouseEventHandler<HTMLButtonElement>) {
      if (onClose && close) {
        onClose();
      } else if (onClick) {
        onClick(e, () => {
          if (onClose) {
            onClose();
          }
        });
      }
    }

    return (
      <Button ref={ref} onClick={_onClose} {...attrs}>
        {children}
      </Button>
    );
  }
);

export default ModalButton;
