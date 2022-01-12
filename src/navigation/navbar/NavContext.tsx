import React, { useState, ReactNode } from 'react';

export type NavContextType = {
  isOpen?: boolean;
  mobile?: string;
  size?: string;
  toggle?: () => void;
  custom?: boolean;
  dark?: boolean;
};

const NavContext = React.createContext<NavContextType | null>(null);

export type NavProviderProps = {
  children?: ReactNode;
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
  custom?: boolean;
  dark?: boolean;
};

function NavProvider({
  children,
  isOpen,
  size,
  custom,
  dark,
}: NavProviderProps) {
  const [state, setState] = useState({
    isOpen: isOpen === true || false,
    mobile: size || 'md',
    size: size || '6xl',
    custom: custom || false,
    dark: dark || false,
  });

  function _toggle() {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  }

  return (
    <NavContext.Provider
      value={{
        isOpen: state.isOpen,
        mobile: state.mobile,
        size: state.size,
        custom: state.custom,
        dark: state.dark,
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
