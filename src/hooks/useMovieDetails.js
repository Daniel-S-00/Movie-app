import { useState, useEffect } from "react";
import { fetchMovieDetails, fetchMovieVideos } from "../services/tmdb.js";

export const useMovieDetails = (movieId, language = "en-US") => {
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) {
      setMovie(null);
      setVideos([]);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const load = async () => {
      try {
        const [details, movieVideos] = await Promise.all([
          fetchMovieDetails(movieId, language),
          fetchMovieVideos(movieId).catch(() => []),
        ]);
        if (!cancelled) {
          setMovie(details);
          setVideos(movieVideos);
        }
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
  }, [movieId, language]);

  return { movie, videos, isLoading, error };
};
