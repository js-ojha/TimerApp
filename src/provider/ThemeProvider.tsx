import React from 'react';
import { DarkTheme, LightTheme, useResolvedTheme } from '../utils/theme';
import { StatusBar } from 'react-native';

type Theme = {
  colors: typeof LightTheme;
  dark: boolean;
  updateTheme: (themeName: 'light' | 'dark' | 'system') => void;
};

const ThemeContext = React.createContext<Theme>(null as any);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme } = useResolvedTheme();
  const dark = theme === 'dark';
  const colors = dark ? DarkTheme : LightTheme;
  return (
    <ThemeContext.Provider value={{ colors, dark, updateTheme: setTheme }}>
      {children}
      <StatusBar
        animated={true}
        backgroundColor={colors.background}
        barStyle={dark ? 'light-content' : 'dark-content'}
      />
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return React.useContext(ThemeContext);
};
