import { useState, useEffect } from "react";
import { fetchMovieDetails } from "../services/tmdb.js";

export const useMovieDetails = (movieId) => {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) {
      setMovie(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const load = async () => {
      try {
        const data = await fetchMovieDetails(movieId);
        if (!cancelled) setMovie(data);
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError("Failed to load movie details");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [movieId]);

  return { movie, isLoading, error };
};
