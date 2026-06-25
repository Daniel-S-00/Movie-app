import { describe, it, expect, beforeEach, vi } from "vitest";
import { fetchMovies, fetchMovieDetails } from "../tmdb.js";

function mockFetch(body, ok = true) {
  return vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok,
    json: async () => body,
  });
}

describe("TMDB service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("fetchMovies", () => {
    it("calls the discover endpoint with no query", async () => {
      const fetchSpy = mockFetch({
        results: [{ id: 1, title: "A" }],
        total_pages: 3,
      });

      const { results, totalPages } = await fetchMovies("", 1);

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&page=1",
        expect.objectContaining({
          headers: expect.objectContaining({
            accept: "application/json",
            Authorization: "Bearer test-tmdb-key",
          }),
        })
      );
      expect(results).toEqual([{ id: 1, title: "A" }]);
      expect(totalPages).toBe(3);
    });

    it("calls the search endpoint with an encoded query", async () => {
      const fetchSpy = mockFetch({ results: [], total_pages: 0 });

      await fetchMovies("hello world", 2);

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://api.themoviedb.org/3/search/movie?query=hello%20world&page=2",
        expect.any(Object)
      );
    });

    it("defaults to page 1 when page is not provided", async () => {
      const fetchSpy = mockFetch({ results: [], total_pages: 0 });

      await fetchMovies();

      const calledUrl = fetchSpy.mock.calls[0][0];
      expect(calledUrl).toMatch(/page=1$/);
    });

    it("throws on a non-ok response", async () => {
      mockFetch(null, false);
      await expect(fetchMovies()).rejects.toThrow("Failed to fetch movies");
    });

    it("returns empty results when the response has no results key", async () => {
      mockFetch({});
      const { results, totalPages } = await fetchMovies();
      expect(results).toEqual([]);
      expect(totalPages).toBe(0);
    });
  });

  describe("fetchMovieDetails", () => {
    it("calls the movie details endpoint with the given id", async () => {
      const movie = { id: 603, title: "The Matrix" };
      const fetchSpy = mockFetch(movie);

      const result = await fetchMovieDetails(603);

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://api.themoviedb.org/3/movie/603",
        expect.any(Object)
      );
      expect(result).toEqual(movie);
    });

    it("throws on a non-ok response", async () => {
      mockFetch(null, false);
      await expect(fetchMovieDetails(1)).rejects.toThrow(
        "Failed to fetch movie details"
      );
    });
  });
});
