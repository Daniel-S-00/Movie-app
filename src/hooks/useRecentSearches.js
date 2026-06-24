import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage.js";

const STORAGE_KEY = "movieApp.recentSearches";
const MAX_RECENT = 5;

export const useRecentSearches = () => {
  const [recent, setRecent] = useLocalStorage(STORAGE_KEY, []);

  const addRecent = useCallback(
    (term) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      setRecent((prev) => {
        const filtered = prev.filter(
          (t) => t.toLowerCase() !== trimmed.toLowerCase()
        );
        return [trimmed, ...filtered].slice(0, MAX_RECENT);
      });
    },
    [setRecent]
  );

  const clearRecent = useCallback(() => {
    setRecent([]);
  }, [setRecent]);

  return { recent, addRecent, clearRecent };
};
