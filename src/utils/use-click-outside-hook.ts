import { useState, useRef, useEffect } from 'react';

export function useClickOutside() {
  const ref = useRef<HTMLElement>();
  const [state, setState] = useState({
    hasClickedOutside: false,
  });

  function handleEvent(e?: any) {
    if (ref && ref.current) {
      if (ref.current.contains(e?.target)) {
        setState({ ...state, hasClickedOutside: false });
      } else {
        if(e?.target) {
          const isMenuToggle = e.target.getAttribute('data-dropdown');
          
          if (isMenuToggle === 'menu-toggle') {
            return;
          }
        }
        setState({ ...state, hasClickedOutside: true });
      }
    }
  }

  useEffect(() => {
    if (window.PointerEvent) {
      document.addEventListener('pointerdown', handleEvent);
    } else {
      document.addEventListener('mousedown', handleEvent);
      document.addEventListener('touchstart', handleEvent);
    }

    return () => {
      if (window.PointerEvent) {
        document.removeEventListener('pointerdown', handleEvent);
      } else {
        document.removeEventListener('mousedown', handleEvent);
        document.removeEventListener('touchstart', handleEvent);
      }
    };
  }, []);

  return [ref, state.hasClickedOutside];
}
