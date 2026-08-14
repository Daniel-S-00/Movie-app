import { useSearchParams } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage.js";
import { LANGUAGES, DEFAULT_LANGUAGE } from "../i18n/languages.js";

const detectBrowserLanguage = () => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const raw = window.navigator.language || DEFAULT_LANGUAGE;
  const normalized = raw.replace("_", "-");
  if (LANGUAGES.some((lang) => lang.code === normalized)) return normalized;
  const primary = normalized.split("-")[0].toLowerCase();
  const match = LANGUAGES.find((lang) =>
    lang.code.toLowerCase().startsWith(primary)
  );
  return match ? match.code : DEFAULT_LANGUAGE;
};

export const useLanguage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stored, setStored] = useLocalStorage("language", null);

  const urlLanguage = searchParams.get("lang");
  const language = urlLanguage ?? stored ?? detectBrowserLanguage();

  const setLanguage = (next) => {
    setStored(next);
    const params = new URLSearchParams(searchParams);
    params.set("lang", next);
    setSearchParams(params, { replace: true });
  };

  return [language, setLanguage];
};
