import { useState, useEffect } from "react";
import { getTrendingMovies } from "../services/appwrite.js";

export const useTrendingMovies = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const movies = await getTrendingMovies();
        setTrendingMovies(movies);
      } catch (error) {
        console.error("Error loading trending movies:", error);
      }
    };

    load();
  }, []);

  return trendingMovies;
};
