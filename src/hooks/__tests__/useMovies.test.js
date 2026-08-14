import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

vi.mock("../../services/tmdb.js", () => ({
  fetchMovies: vi.fn(),
}));
vi.mock("../../services/appwrite.js", () => ({
  updateSearchCount: vi.fn(),
}));

import { fetchMovies } from "../../services/tmdb.js";
import { updateSearchCount } from "../../services/appwrite.js";
import { useMovies } from "../useMovies.js";

describe("useMovies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchMovies.mockResolvedValue({ results: [], totalPages: 0 });
    updateSearchCount.mockResolvedValue();
  });

  it("fetches the first page of popular movies on mount", async () => {
    fetchMovies.mockResolvedValueOnce({
      results: [{ id: 1, title: "Inception" }],
      totalPages: 5,
    });

    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetchMovies).toHaveBeenCalledWith("", 1, "en-US");
    expect(result.current.movieList).toEqual([{ id: 1, title: "Inception" }]);
    expect(result.current.hasMore).toBe(true);
  });

  it("refetches with the new language when the language changes", async () => {
    fetchMovies.mockResolvedValue({
      results: [{ id: 1, title: "Origen" }],
      totalPages: 1,
    });

    const { rerender } = renderHook(
      ({ language }) => useMovies("", undefined, language),
      { initialProps: { language: "en-US" } }
    );

    await waitFor(() => {
      expect(fetchMovies).toHaveBeenCalledWith("", 1, "en-US");
    });

    rerender({ language: "es-MX" });

    await waitFor(() => {
      expect(fetchMovies).toHaveBeenCalledWith("", 1, "es-MX");
    });
  });

  it("debounces search term changes before fetching", async () => {
    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    fetchMovies.mockClear();

    act(() => {
      result.current.setSearchTerm("matrix");
    });

    expect(fetchMovies).not.toHaveBeenCalled();

    await waitFor(
      () => {
        expect(fetchMovies).toHaveBeenCalledWith("matrix", 1, "en-US");
      },
      { timeout: 1500 }
    );
  });

  it("calls updateSearchCount and onSearchSuccess on a successful non-empty search", async () => {
    fetchMovies.mockResolvedValueOnce({
      results: [{ id: 42, title: "The Matrix" }],
      totalPages: 1,
    });
    const onSearchSuccess = vi.fn();

    renderHook(() => useMovies("matrix", onSearchSuccess));

    await waitFor(() => {
      expect(updateSearchCount).toHaveBeenCalledWith("matrix", {
        id: 42,
        title: "The Matrix",
      });
    });

    expect(onSearchSuccess).toHaveBeenCalledWith("matrix");
  });

  it("skips updateSearchCount when the search returns no results", async () => {
    fetchMovies.mockResolvedValueOnce({ results: [], totalPages: 0 });

    renderHook(() => useMovies("nothingmatches"));

    await waitFor(() => {
      expect(fetchMovies).toHaveBeenCalled();
    });

    expect(updateSearchCount).not.toHaveBeenCalled();
  });

  it("sets an error message when the fetch fails", async () => {
    fetchMovies.mockRejectedValueOnce(new Error("Network down"));

    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toMatch(/error fetching movies/i);
    expect(result.current.movieList).toEqual([]);
  });

  it("loadMore appends results and advances the page", async () => {
    fetchMovies
      .mockResolvedValueOnce({
        results: [{ id: 1 }],
        totalPages: 3,
      })
      .mockResolvedValueOnce({
        results: [{ id: 2 }, { id: 3 }],
        totalPages: 3,
      });

    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasMore).toBe(true);

    await act(async () => {
      await result.current.loadMore();
    });

    expect(fetchMovies).toHaveBeenCalledTimes(2);
    expect(fetchMovies).toHaveBeenNthCalledWith(2, "", 2, "en-US");
    expect(result.current.movieList).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  it("loadMore is a no-op when hasMore is false", async () => {
    fetchMovies.mockResolvedValueOnce({ results: [{ id: 1 }], totalPages: 1 });

    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasMore).toBe(false);

    fetchMovies.mockClear();
    await act(async () => {
      await result.current.loadMore();
    });

    expect(fetchMovies).not.toHaveBeenCalled();
  });
});
