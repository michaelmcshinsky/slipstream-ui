import React, { ReactNode } from 'react';

export interface DropdownMenuProps {
  outsideRef: boolean | React.MutableRefObject<undefined>;
  setPopperElement: Function;
  children?: ReactNode;
  styles: {
    [key: string]: React.CSSProperties;
  };
  attributes: {
    [key: string]:
      | {
          [key: string]: string;
        }
      | undefined;
  };
}

export function DropdownMenu(props: DropdownMenuProps) {
  return (
    <div
      ref={mergeRefs(props.outsideRef, props.setPopperElement)}
      style={props.styles.popper}
      className="border border-solid border-gray-300 rounded bg-white py-1 my-1"
      {...props.attributes.popper}
    >
      {props.children}
    </div>
  );
}

const mergeRefs = (...refs: any[]) => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return (inst: any) => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };
};
