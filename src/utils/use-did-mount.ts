import { useEffect, useRef } from 'react';

export function useDidMount(func: () => void, deps: undefined | [any]) {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      func();
    } else {
      didMount.current = true;
    }
  }, deps);
}
