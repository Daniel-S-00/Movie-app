import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

vi.mock("../../services/tmdb.js", () => ({
  fetchMovieDetails: vi.fn(),
  fetchMovieVideos: vi.fn(),
}));

import { fetchMovieDetails, fetchMovieVideos } from "../../services/tmdb.js";
import { useMovieDetails } from "../useMovieDetails.js";

describe("useMovieDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchMovieDetails.mockResolvedValue({ id: 603, title: "The Matrix" });
    fetchMovieVideos.mockResolvedValue([{ site: "YouTube", key: "abc" }]);
  });

  it("fetches details and videos for the given id", async () => {
    const { result } = renderHook(() => useMovieDetails(603));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetchMovieDetails).toHaveBeenCalledWith(603);
    expect(fetchMovieVideos).toHaveBeenCalledWith(603);
    expect(result.current.movie).toEqual({ id: 603, title: "The Matrix" });
    expect(result.current.videos).toEqual([{ site: "YouTube", key: "abc" }]);
  });

  it("defaults videos to an empty array when the videos request fails", async () => {
    fetchMovieVideos.mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useMovieDetails(603));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.movie).toEqual({ id: 603, title: "The Matrix" });
    expect(result.current.videos).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("sets an error when fetching details fails", async () => {
    fetchMovieDetails.mockRejectedValue(new Error("Network down"));

    const { result } = renderHook(() => useMovieDetails(603));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to load movie details");
    expect(result.current.movie).toBeNull();
  });

  it("clears state when the id becomes null", async () => {
    const { result, rerender } = renderHook(({ id }) => useMovieDetails(id), {
      initialProps: { id: 603 },
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    rerender({ id: null });

    expect(result.current.movie).toBeNull();
    expect(result.current.videos).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
});
