import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../useLocalStorage.js";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("returns the initial value when storage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("key", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("returns the stored value when present in localStorage", () => {
    localStorage.setItem("key", JSON.stringify("stored"));
    const { result } = renderHook(() => useLocalStorage("key", "default"));
    expect(result.current[0]).toBe("stored");
  });

  it("persists value changes to localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("key", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    expect(JSON.parse(localStorage.getItem("key"))).toBe("updated");
  });

  it("supports complex (object) values", () => {
    const initial = { a: 1, b: [2, 3] };
    const { result } = renderHook(() => useLocalStorage("obj", initial));

    expect(result.current[0]).toEqual(initial);

    act(() => {
      result.current[1]({ a: 99, b: [] });
    });

    expect(result.current[0]).toEqual({ a: 99, b: [] });
    expect(JSON.parse(localStorage.getItem("obj"))).toEqual({ a: 99, b: [] });
  });

  it("falls back to initial value on JSON parse error", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    localStorage.setItem("key", "not-valid-json{");

    const { result } = renderHook(() => useLocalStorage("key", "fallback"));

    expect(result.current[0]).toBe("fallback");
  });
});
