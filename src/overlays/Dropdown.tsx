import React, { useState, useEffect, ReactNode } from 'react';
import { usePopper } from 'react-popper';
import { useClickOutside } from '../utils';
import { DropdownProvider, useDropdown } from './DropdownContext';
import { DropdownMenu } from './DropdownMenu';

export interface DropdownProps {
  className?: string;
  isOpen: boolean;
  children: ReactNode;
  onClick?: (e: React.MouseEventHandler<HTMLButtonElement>) => void;
  tag?: any;
}

export function Dropdown(props: DropdownProps) {
  const [state, setState] = useState({
    isOpen: false,
  });
  const { className, children, tag: Tag } = props;
  const { context, setContext } = useDropdown();
  console.log('context', context);

  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    strategy: 'absolute',
    placement: 'bottom-start',
  });
  const [outsideRef, hasClickedOutside] = useClickOutside();

  useEffect(() => {
    if (hasClickedOutside) {
      setState({ ...state, isOpen: false });
    }
  }, [hasClickedOutside]);

  function _handleToggle(e?: Event) {
    e?.preventDefault?.();
    setState((prev) => ({ ...prev, isOpen: !state.isOpen }));
  }

  console.log('state.isOpen', state.isOpen);

  return (
    <DropdownProvider>
      <div className="sui-dropdown relative inline-block">
        <Tag ref={setReferenceElement} onClick={_handleToggle}>
          Reference element
        </Tag>
        {state.isOpen && (
          <DropdownMenu
            outsideRef={outsideRef}
            setPopperElement={setPopperElement}
            styles={styles}
            attributes={attributes}
          >
            {children}
          </DropdownMenu>
        )}
      </div>
    </DropdownProvider>
  );
}

Dropdown.defaultProps = {
  isOpen: false,
  tag: 'button',
};
