import { useEffect, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage.js";

const STORAGE_KEY = "movieApp.theme";

export const THEMES = {
  DARK: "dark",
  LIGHT: "light",
};

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage(STORAGE_KEY, THEMES.DARK);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK));
  }, [setTheme]);

  return { theme, setTheme, toggleTheme };
};
