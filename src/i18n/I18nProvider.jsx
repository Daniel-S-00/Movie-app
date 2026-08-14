import { useMemo } from "react";
import { messages } from "./messages.js";
import { DEFAULT_LANGUAGE } from "./languages.js";
import { I18nContext } from "./I18nContext.js";

function interpolate(template, vars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? String(vars[key]) : match
  );
}

const createT = (dict) => (key, vars) =>
  interpolate(dict[key] ?? messages[DEFAULT_LANGUAGE][key] ?? key, vars);

export function I18nProvider({ language, children }) {
  const dict = messages[language] ?? messages[DEFAULT_LANGUAGE];
  const value = useMemo(
    () => ({ language, t: createT(dict) }),
    [language, dict]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export default I18nProvider;
