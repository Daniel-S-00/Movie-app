import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "react-use";
import { fetchMovies } from "../services/tmdb.js";
import { updateSearchCount } from "../services/appwrite.js";

export const useMovies = (initialSearchTerm = "") => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearchTerm);
  const [movieList, setMovieList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useDebounce(
    () => setDebouncedSearchTerm(searchTerm),
    500,
    [searchTerm]
  );

  useEffect(() => {
    let cancelled = false;
    setPage(1);
    setMovieList([]);
    setHasMore(true);
    setIsLoading(true);
    setErrorMessage("");

    const loadFirstPage = async () => {
      try {
        const { results, totalPages } = await fetchMovies(debouncedSearchTerm, 1);
        if (cancelled) return;
        setMovieList(results);
        setHasMore(1 < totalPages);
        if (debouncedSearchTerm && results.length > 0) {
          await updateSearchCount(debouncedSearchTerm, results[0]);
        }
      } catch (error) {
        if (cancelled) return;
        console.error(error);
        setErrorMessage("Error fetching movies, please try again later");
        setMovieList([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadFirstPage();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearchTerm]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || isLoading) return;
    const nextPage = page + 1;
    setIsLoadingMore(true);
    try {
      const { results, totalPages } = await fetchMovies(debouncedSearchTerm, nextPage);
      setMovieList((prev) => [...prev, ...results]);
      setPage(nextPage);
      setHasMore(nextPage < totalPages);
    } catch (error) {
      console.error(error);
      setErrorMessage("Error loading more movies");
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, isLoading, page, debouncedSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    movieList,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    errorMessage,
  };
};
