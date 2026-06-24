import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import { fetchMovies } from "../services/tmdb.js";
import { updateSearchCount } from "../services/appwrite.js";

export const useMovies = (initialSearchTerm = "") => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearchTerm);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useDebounce(
    () => setDebouncedSearchTerm(searchTerm),
    500,
    [searchTerm]
  );

  useEffect(() => {
    const loadMovies = async (query = "") => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const results = await fetchMovies(query);
        setMovieList(results);
        if (query && results.length > 0) {
          await updateSearchCount(query, results[0]);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Error fetching movies, please try again later");
        setMovieList([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return { searchTerm, setSearchTerm, movieList, isLoading, errorMessage };
};
