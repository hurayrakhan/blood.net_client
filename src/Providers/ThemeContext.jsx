import React, { createContext, useEffect, useState } from 'react';

// Create context to share mode and toggle function
// eslint-disable-next-line react-refresh/only-export-components
export const ColorModeContext = createContext();

export default function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState('light');

  // On mount: read saved mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('colorMode');
    if (savedMode === 'dark' || savedMode === 'light') {
      setMode(savedMode);
    }
  }, []);

  // Update the <html> class for Tailwind dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  // Toggle and persist the theme mode
  const toggleColorMode = () => {
    const nextMode = mode === 'light' ? 'dark' : 'light';
    setMode(nextMode);
    localStorage.setItem('colorMode', nextMode);
  };

  return (
    <ColorModeContext.Provider value={{ toggleColorMode, mode }}>
      {children}
    </ColorModeContext.Provider>
  );
}
