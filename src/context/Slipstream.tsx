import React, {
  createContext,
  HTMLAttributes,
  ReactNode,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

export type TThemeContext = {
  dark?: boolean;
  toggle?: () => void;
}

export const ThemeContext = createContext<TThemeContext>({
  dark: false,
});

export type ProviderProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  dark?: boolean;
}

export function SlipstreamProvider({ children, dark: defaultDark }: ProviderProps) {
  const [dark, setMode] = useState(defaultDark);

  useLayoutEffect(() => {
    if (dark) {
      document.documentElement.classList.add(`dark`);
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  function _toggleDark() {
    if (dark) {
      document.documentElement.classList.remove('dark');
      setMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setMode(true);
    }
  }

  const value = useMemo(
    () => ({
      dark,
      toggleDark: _toggleDark,
    }),
    [dark]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

SlipstreamProvider.displayName = 'SlipstreamProvider';
SlipstreamProvider.defaultProps = {
  dark: false,
};
