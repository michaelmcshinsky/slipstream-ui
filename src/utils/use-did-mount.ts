import { useEffect, useRef, DependencyList } from 'react';

export function useDidMount(func: () => void, deps: DependencyList) {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      func();
    } else {
      didMount.current = true;
    }
  }, deps);
}
