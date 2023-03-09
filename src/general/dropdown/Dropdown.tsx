import React, { useState, useEffect, ReactNode, forwardRef } from 'react';
import clsx from 'clsx';
import { usePopper } from 'react-popper';
import { useClickOutside } from '../../utils';
import { ComputedPlacement } from '@popperjs/core/lib/enums';
import DropdownMenu, { TDropdownMenu } from './DropdownMenu';
import DropdownItem, { TDropdownItem } from './DropdownItem';
import DropdownToggle, { TDropdownToggle } from './DropdownToggle';

export type TDropdown = {
  children?: ReactNode;
  className?: string;
  direction?: DirectionTypes;
  disableOutsideClick?: boolean;
  icon?: boolean;
  isOpen: boolean;
  offset?: number;
  onClick?: (state: object) => void;
  right?: RightTypes;
  rtl?: boolean;
};

type DropdownComponent = React.ForwardRefExoticComponent<
  TDropdown & React.RefAttributes<HTMLDivElement>
> & {
  Item: React.ForwardRefExoticComponent<
    TDropdownItem & React.RefAttributes<HTMLElement>
  >;
  Menu: React.ForwardRefExoticComponent<
    TDropdownMenu & React.RefAttributes<HTMLElement>
  >;
  Toggle: React.ForwardRefExoticComponent<
    TDropdownToggle & React.RefAttributes<HTMLElement>
  >;
};

type DirectionTypes = 'top' | 'right' | 'bottom' | 'left';
type RightTypes = 'start' | 'end';

export const Dropdown = forwardRef<HTMLDivElement, TDropdown>((props, ref) => {
  const [state, setState] = useState({
    isOpen: false,
    toggleID: Math.random().toString(),
  });
  const {
    children,
    className,
    direction,
    disableOutsideClick,
    icon,
    isOpen,
    offset,
    onClick,
    right,
    rtl,
    ...attrs
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

  const placement: string =
    direction && right ? `${direction}-${right}` : 'bottom-start';
  const computedPlacement: ComputedPlacement = placement as ComputedPlacement;

  const [outsideRef, hasClickedOutside, setOutside] = useClickOutside(
    state.toggleID
  );
  const [popperElement, setPopperElement] = useState(null);
  const [referenceElement, setReferenceElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    strategy: 'fixed',
    placement: computedPlacement,
    modifiers: [offsetModifier],
  });

  useEffect(() => {
    if (onClick) {
      onClick(state);
    }
    if (
      hasClickedOutside &&
      (disableOutsideClick === false || !disableOutsideClick)
    ) {
      setState({ ...state, isOpen: false });
      setOutside(false);
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
          'data-dropdown': state.toggleID,
          dataDropdown: state.toggleID,
          icon: icon,
          rtl: rtl,
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
      return child;
    });

  const classes = clsx(
    'sui--dropdown relative inline-block',
    { 'z-10': !className?.includes('z-') },
    className
  );

  return (
    <div ref={ref} className={classes} {...attrs}>
      {renderedChildren}
    </div>
  );
}) as DropdownComponent;

Dropdown.displayName = 'Dropdown';
Dropdown.Item = DropdownItem;
Dropdown.Menu = DropdownMenu;
Dropdown.Toggle = DropdownToggle;

Dropdown.defaultProps = {
  isOpen: undefined,
  disableOutsideClick: false,
  direction: 'bottom',
  right: 'start',
  offset: 4,
};

export default Dropdown;
