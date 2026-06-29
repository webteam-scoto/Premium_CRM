import { createContext, useContext, useState, useEffect } from "react";

const light = {
  primary: '#0B5331',
  secondary: '#10B981',
  background: '#F8FAFC',
  surface: '#F1F5F9',
  card: '#FFFFFF',
  border: '#E2E8F0',
  text: '#15803D',
  textPrimary: '#0F172A',
  textSecondary: '#334155',
  textPlaceholder: '#64748B',
  success: '#059669',
  error: '#E11D48',
  warning: '#D97706',
  info: '#0284C7',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  // Sidebar & header
  sidebarBg: '#1a3d2b',
  headerBg: '#0B5331',
  sidebarText: 'rgba(255,255,255,0.75)',
  sidebarActive: '#2d6a4f',
  accentLight: '#52b788',
  tableRowBg: '#FFFFFF',
  tableAltBg: '#F8FAFC',
  inputBg: '#FFFFFF',
  inputBorder: '#E2E8F0',
};

const dark = {
  primary: '#17a370',
  secondary: '#2ca378',
  background: '#090D16',
  surface: '#151E31',
  card: '#111827',
  border: '#22314D',
  text: '#15803D',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textPlaceholder: '#475569',
  success: '#34D399',
  error: '#FB7185',
  warning: '#FBBF24',
  info: '#38BDF8',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  // Sidebar & header
  sidebarBg: '#0d1f17',
  headerBg: '#0d1f17',
  sidebarText: 'rgba(255,255,255,0.65)',
  sidebarActive: '#17a370',
  accentLight: '#34D399',
  tableRowBg: '#111827',
  tableAltBg: '#151E31',
  inputBg: '#151E31',
  inputBorder: '#22314D',
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("premier_theme") === "dark";
  });

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem("premier_theme", next ? "dark" : "light");
      return next;
    });
  };

  const colors = isDark ? dark : light;

  useEffect(() => {
    document.body.style.background = colors.background;
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
