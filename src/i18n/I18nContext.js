import { createContext, useContext } from "react";
import { messages } from "./messages.js";
import { DEFAULT_LANGUAGE } from "./languages.js";

function interpolate(template, vars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? String(vars[key]) : match
  );
}

const createT = (dict) => (key, vars) =>
  interpolate(dict[key] ?? messages[DEFAULT_LANGUAGE][key] ?? key, vars);

export const I18nContext = createContext({
  language: DEFAULT_LANGUAGE,
  t: createT(messages[DEFAULT_LANGUAGE]),
});

export const useI18n = () => useContext(I18nContext);
