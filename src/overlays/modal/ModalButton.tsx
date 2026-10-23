import React, { forwardRef, ReactNode } from 'react';
import { Button, TButton } from '../..';

type Callback = {
  (): void;
}

export type TModalButton = Omit<TButton, 'onClick'> & {
  children?: ReactNode;
  close?: boolean;
  onClick?: (
    e: React.MouseEvent<HTMLElement>,
    callback: Callback
  ) => void;
  toggle?: Callback;
}

export const ModalButton = forwardRef<HTMLButtonElement, TModalButton>(
  (props, ref) => {
    const { children, close, onClick, toggle, type, ...attrs } = props;

    function _toggle(e: React.MouseEvent<HTMLElement>) {
      if (toggle && close) {
        toggle();
      } else if (onClick) {
        onClick(e, () => {
          if (toggle) {
            toggle();
          }
        });
      }
    }

    return (
      <Button ref={ref} onClick={_toggle} {...attrs}>
        {children}
      </Button>
    );
  },
);

ModalButton.displayName = 'ModalButton';

export default ModalButton;
