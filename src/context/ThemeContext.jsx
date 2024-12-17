import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeStatus = localStorage.getItem('darkMode');
    const expiryTime = localStorage.getItem('darkModeExpiry');

    const currentTime = new Date().getTime();

    if (darkModeStatus && expiryTime && currentTime < expiryTime) {
      setIsDarkMode(JSON.parse(darkModeStatus));
    } else {
      localStorage.removeItem('darkMode');
      localStorage.removeItem('darkModeExpiry');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newDarkMode = !prev;

      if (newDarkMode) {

        localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
        localStorage.setItem('darkModeExpiry', new Date().getTime() + 2 * 24 * 60 * 60 * 1000); 
      } else {
        localStorage.removeItem('darkMode');
        localStorage.removeItem('darkModeExpiry');
      }

      return newDarkMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
