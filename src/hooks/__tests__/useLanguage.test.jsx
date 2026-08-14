import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useLanguage } from "../useLanguage.js";

const wrapper = (initialEntries) => ({ children }) => (
  <MemoryRouter initialEntries={[initialEntries]}>{children}</MemoryRouter>
);

describe("useLanguage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("defaults to en-US when nothing is set", () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: wrapper("/"),
    });
    expect(result.current[0]).toBe("en-US");
  });

  it("reads the language from the URL lang param", () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: wrapper("/?lang=fr-FR"),
    });
    expect(result.current[0]).toBe("fr-FR");
  });

  it("prefers the URL lang over a stored value", () => {
    window.localStorage.setItem("language", JSON.stringify("ja-JP"));
    const { result } = renderHook(() => useLanguage(), {
      wrapper: wrapper("/?lang=fr-FR"),
    });
    expect(result.current[0]).toBe("fr-FR");
  });

  it("falls back to the browser language mapped to a curated locale", () => {
    const original = window.navigator.language;
    Object.defineProperty(window.navigator, "language", {
      value: "es",
      configurable: true,
    });
    try {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: wrapper("/"),
      });
      expect(result.current[0]).toBe("es-MX");
    } finally {
      Object.defineProperty(window.navigator, "language", {
        value: original,
        configurable: true,
      });
    }
  });

  it("persists the choice to localStorage", () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: wrapper("/"),
    });
    act(() => result.current[1]("de-DE"));
    expect(result.current[0]).toBe("de-DE");
    expect(JSON.parse(window.localStorage.getItem("language"))).toBe("de-DE");
  });
});
