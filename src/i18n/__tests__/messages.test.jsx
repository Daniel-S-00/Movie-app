import { describe, it, expect } from "vitest";
import { messages } from "../messages.js";
import { LANGUAGES, DEFAULT_LANGUAGE } from "../languages.js";
import { I18nProvider } from "../I18nProvider.jsx";
import { useI18n } from "../I18nContext.js";
import { renderHook } from "@testing-library/react";

describe("i18n messages", () => {
  const enKeys = Object.keys(messages[DEFAULT_LANGUAGE]).sort();

  it("defines messages for every curated language", () => {
    expect(LANGUAGES.map((l) => l.code)).toEqual(Object.keys(messages));
  });

  it("every locale defines the same keys as English", () => {
    for (const [code, dict] of Object.entries(messages)) {
      const keys = Object.keys(dict).sort();
      expect(keys, code).toEqual(enKeys);
    }
  });
});

describe("useI18n", () => {
  const setup = (language) =>
    renderHook(() => useI18n(), {
      wrapper: ({ children }) => (
        <I18nProvider language={language}>{children}</I18nProvider>
      ),
    });

  it("translates a key for the active language", () => {
    const { result } = setup("es-MX");
    expect(result.current.t("hero.title")).toBe(
      "Encuentra películas que amarás"
    );
  });

  it("interpolates variables into the message", () => {
    const { result } = setup("en-US");
    expect(
      result.current.t("empty.noResults", { term: "matrix" })
    ).toBe('No movies found for "matrix"');
  });

  it("falls back to English for a missing key", () => {
    const { result } = setup("es-MX");
    expect(result.current.t("no.such.key")).toBe("no.such.key");
  });

  it("falls back to English for an unsupported language", () => {
    const { result } = setup("xx-XX");
    expect(result.current.t("movies.title")).toBe("All movies");
  });
});
