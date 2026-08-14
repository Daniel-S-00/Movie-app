import { config } from "../config.js";

const API_BASE_URL = "https://api.themoviedb.org/3";

const DEFAULT_LANGUAGE = "en-US";

const API_OPTIONS = {
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${config.tmdb.apiKey}`,
  },
};

export const fetchMovies = async (query = "", page = 1, language = DEFAULT_LANGUAGE) => {
  const endpoint = query
    ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}&language=${language}`
    : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}&language=${language}`;

  const response = await fetch(endpoint, API_OPTIONS);

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();
  return {
    results: data.results ?? [],
    totalPages: data.total_pages ?? 0,
  };
};

export const fetchMovieDetails = async (id, language = DEFAULT_LANGUAGE) => {
  const response = await fetch(
    `${API_BASE_URL}/movie/${id}?language=${language}`,
    API_OPTIONS
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }

  return response.json();
};

export const fetchMovieVideos = async (id) => {
  const response = await fetch(`${API_BASE_URL}/movie/${id}/videos`, API_OPTIONS);

  if (!response.ok) {
    throw new Error("Failed to fetch movie videos");
  }

  const data = await response.json();
  return data.results ?? [];
};
