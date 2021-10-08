import React, { useState, useEffect, ReactNode } from 'react';
import classNames from 'classnames';
import { usePopper } from 'react-popper';
import { useClickOutside } from '../utils';
import { ComputedPlacement } from '@popperjs/core/lib/enums';

export interface DropdownProps {
  className?: string;
  isOpen: boolean;
  children: ReactNode;
  onClick?: (state: object) => void;
  disableOutsideClick?: boolean;
  direction?: DirectionTypes;
  right?: RightTypes;
  offset?: number;
}

type DirectionTypes = 'top' | 'right' | 'bottom' | 'left';
type RightTypes = 'start' | 'end';

export function Dropdown(props: DropdownProps) {
  const [state, setState] = useState({
    isOpen: false,
  });
  const {
    className,
    children,
    isOpen,
    onClick,
    disableOutsideClick,
    direction,
    right,
    offset,
  } = props;

  const offsetModifier = {
    name: 'offset',
    options: {
      offset: [
        direction === 'left' || direction === 'right' ? 0 : 0,
        direction === 'top' ||
        direction === 'bottom' ||
        ((direction === 'left' || direction === 'right') &&
          (right === 'start' || right === 'end'))
          ? offset
          : 0,
      ],
    },
  };

  const placement: string = direction && right ? `${direction}-${right}` : 'bottom-start';
  const computedPlacement: ComputedPlacement = placement as ComputedPlacement;

  const [outsideRef, hasClickedOutside] = useClickOutside();
  const [popperElement, setPopperElement] = useState(null);
  const [referenceElement, setReferenceElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    strategy: 'absolute',
    placement: computedPlacement,
    modifiers: [offsetModifier],
  });

  useEffect(() => {
    if (onClick) {
      onClick(state);
    }
    if (hasClickedOutside && disableOutsideClick === false) {
      setState({ ...state, isOpen: false });
    }
  }, [hasClickedOutside]);

  useEffect(() => {
    setState((prev) => ({ ...prev, isOpen }));
  }, [isOpen]);

  function _handleToggle() {
    if (isOpen === undefined || isOpen === null) {
      setState((prev) => ({ ...prev, isOpen: !state.isOpen }));
    }
  }

  const renderedChildren = React.Children.toArray(children)
    .filter(Boolean)
    .map((child: any) => {
      if (child?.type?.displayName?.includes?.('DropdownToggle')) {
        return React.cloneElement(child, {
          ref: setReferenceElement,
          onClick: _handleToggle,
          ['data-dropdown']: 'menu-toggle',
        });
      }
      if (child?.type?.displayName?.includes?.('DropdownMenu')) {
        return React.cloneElement(child, {
          outsideRef: outsideRef,
          setPopperElement: setPopperElement,
          styles: styles,
          attributes: attributes,
          isOpen: state.isOpen,
        });
      }
      return React.cloneElement(child);
    });

  const classes = classNames('sui-dropdown relative inline-block', className);

  return <div className={classes}>{renderedChildren}</div>;
}

Dropdown.defaultProps = {
  isOpen: undefined,
  disableOutsideClick: false,
  direction: 'bottom',
  right: 'start',
  offset: 4,
};
