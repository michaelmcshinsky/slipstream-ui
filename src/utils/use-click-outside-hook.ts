import { useState, useRef, useEffect } from 'react';

export function useClickOutside() {
  const ref = useRef<HTMLElement>();
  const [isOutside, setOutside] = useState(false);

  function handleEvent(e?: any) {
    if (ref && ref.current) {
      if (ref.current.contains(e?.target)) {
        setOutside(false);
      } else {
        if (e?.target) {
          const isMenuToggle = e.target.getAttribute('data-dropdown');
          if (isMenuToggle === 'menu-toggle') {
            return;
          }
        }
        setOutside(true);
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

  return [ref, isOutside, setOutside] as const;
}
