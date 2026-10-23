import React, { useState, ReactNode } from 'react';

export type NavContextType = {
  custom?: boolean;
  disableScroll?: boolean;
  isOpen?: boolean;
  mobile?: string;
  size?: string;
  toggle?: () => void;
};

const NavContext = React.createContext<NavContextType | null>(null);

export type NavProviderProps = {
  children?: ReactNode;
  custom?: boolean;
  disableScroll?: boolean;
  isOpen?: boolean;
  mobile?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  size?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl';
};

function NavProvider({
  children,
  custom,
  disableScroll,
  isOpen,
  size,
}: NavProviderProps) {
  const [state, setState] = useState({
    custom: custom || false,
    disableScroll: disableScroll || false,
    isOpen: isOpen === true || false,
    mobile: size || 'md',
    size: size || '6xl',
  });

  function _toggle() {
    if (state.disableScroll) {
      if (state.isOpen) {
        document.body.style.overflow = 'auto';
      } else {
        document.body.style.overflow = 'hidden';
      }
    }
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  }

  return (
    <NavContext.Provider
      value={{
        custom: state.custom,
        disableScroll: state.disableScroll,
        isOpen: state.isOpen,
        mobile: state.mobile,
        size: state.size,
        toggle: _toggle,
      }}
    >
      {children}
    </NavContext.Provider>
  );
}

NavProvider.displayName = 'NavProvider';

const useNav = () => React.useContext(NavContext);

export { NavProvider, useNav };
