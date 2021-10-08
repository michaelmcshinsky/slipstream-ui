import React, { useState, createContext, useContext, ReactNode } from 'react';

const DropdownContext = createContext({});

export interface DropdownProviderProps {
  children: ReactNode
}

export function DropdownProvider ({ children }: DropdownProviderProps) {
  const [context, setContext] = useState(null);

  return (
    <DropdownContext.Provider value={{ context, setContext }}>
      {children}
    </DropdownContext.Provider>
  );
}

function useDropdown () {

  const context = useContext(DropdownContext);
  if (context === undefined) {
    throw new Error('useDropdown must be used within a DropdownProvider');
  }
  return context;
}

export { useDropdown, DropdownContext };
