import { config } from "../config.js";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_OPTIONS = {
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${config.tmdb.apiKey}`,
  },
};

export const fetchMovies = async (query = "") => {
  const endpoint = query
    ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, API_OPTIONS);

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();
  return data.results ?? [];
};

export const fetchMovieDetails = async (id) => {
  const response = await fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS);

  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }

  return response.json();
};
