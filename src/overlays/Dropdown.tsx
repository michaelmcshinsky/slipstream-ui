import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { usePopper } from 'react-popper';
import { Button } from '../index';
import { useClickOutside } from '../utils'

export interface DropdownProps {
  className?: string;
  isOpen: boolean;
  onClick?: (
    e: React.MouseEventHandler<HTMLButtonElement>
  ) => void;
}

export function Dropdown(props: DropdownProps) {
  const [state, setState] = useState({
    isOpen: false
  })
  const { className, isOpen, onClick } = props;

  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { state: popperState, update, styles, attributes } = usePopper(referenceElement, popperElement, { placement: 'bottom'});
  const [outsideRef, hasClickedOutside] = useClickOutside()

  useEffect(() => {
    console.log('hasClickedOutside', hasClickedOutside)
  },[hasClickedOutside])

  function _handleToggle () {
    setState({...state, isOpen: !state.isOpen})
  }

  const classes = classNames('', className);

  return (
    <>
        <button
          color="default"
          type="button"
          ref={setReferenceElement}
          className={classes}
          onClick={_handleToggle}
        >
          Reference element
        </button>
        {state.isOpen && (
        <div ref={mergeRefs(outsideRef, setPopperElement)} style={styles.popper} className="shadow p-2" {...attributes.popper}>
          Popper element
        </div>

        )}
    </>
  );
}

Dropdown.defaultProps = {
  isOpen: false,
};

const mergeRefs = (...refs) => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return inst => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };
};