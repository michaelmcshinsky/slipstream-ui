import React, { forwardRef, ReactNode } from 'react';
import { Button, ButtonProps } from '../forms/Button';

interface Callback {
  (): void;
}

export interface ModalButtonProps extends ButtonProps {
  children?: ReactNode;
  close?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onClose?: Callback;
}

export const ModalButton = forwardRef<HTMLButtonElement, ModalButtonProps>(
  (props, ref) => {
    const { children, close, onClick, onClose, type, ...attrs } = props;

    function _onClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      if (onClose && close) {
        onClose();
      } else if (onClick) {
        onClick(e);
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
