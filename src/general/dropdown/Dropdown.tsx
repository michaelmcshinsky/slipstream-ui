import React, { useState, useEffect, ReactNode, forwardRef } from 'react';
import classNames from 'classnames';
import { usePopper } from 'react-popper';
import { useClickOutside } from '../../utils';
import { ComputedPlacement } from '@popperjs/core/lib/enums';
import DropdownMenu, { DropdownMenuProps } from './DropdownMenu';
import DropdownItem, { DropdownItemProps } from './DropdownItem';
import DropdownToggle, { DropdownToggleProps } from './DropdownToggle';

export interface DropdownProps {
  className?: string;
  isOpen: boolean;
  children: ReactNode;
  onClick?: (state: object) => void;
  disableOutsideClick?: boolean;
  direction?: DirectionTypes;
  right?: RightTypes;
  offset?: number;
  icon?: boolean;
  rtl?: boolean;
}

interface DropdownComponent
  extends React.ForwardRefExoticComponent<
    DropdownProps & React.RefAttributes<HTMLDivElement>
  > {
  Item: React.ForwardRefExoticComponent<
    DropdownItemProps & React.RefAttributes<HTMLElement>
  >;
  Menu: React.ForwardRefExoticComponent<
    DropdownMenuProps & React.RefAttributes<HTMLElement>
  >;
  Toggle: React.ForwardRefExoticComponent<
    DropdownToggleProps & React.RefAttributes<HTMLElement>
  >;
}

type DirectionTypes = 'top' | 'right' | 'bottom' | 'left';
type RightTypes = 'start' | 'end';

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (props, ref) => {
    const [state, setState] = useState({
      isOpen: false,
      toggleID: Math.random().toString(),
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
      icon,
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

    const [outsideRef, hasClickedOutside, setOutside] = useClickOutside(state.toggleID);
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
        return React.cloneElement(child);
      });

    const classes = classNames(
      'sui--dropdown relative inline-block',
      { 'z-10': !className?.includes('z-') },
      className,
    );

    return (
      <div ref={ref} className={classes} {...attrs}>
        {renderedChildren}
      </div>
    );
  },
) as DropdownComponent;

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
