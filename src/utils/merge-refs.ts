import { MutableRefObject, Ref } from 'react';

export const mergeRefs = <T>(
  ...refs: Array<Ref<T> | MutableRefObject<T | null> | undefined | null>
): Ref<T> | null => {
  const filteredRefs = refs.filter(Boolean) as Array<Ref<T>>;
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 1) return filteredRefs[0] ?? null;
  return (inst: T | null) => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(inst);
      } else if (ref) {
        (ref as MutableRefObject<T | null>).current = inst;
      }
    }
  };
};
