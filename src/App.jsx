import { useState, useCallback } from "react";
import Search from "./components/Search";
import SkeletonCard from "./components/SkeletonCard";
import MovieCard from "./components/MovieCard";
import MovieDetails from "./components/MovieDetails";
import Modal from "./components/Modal";
import EmptyState from "./components/EmptyState";
import { useMovies } from "./hooks/useMovies.js";
import { useTrendingMovies } from "./hooks/useTrendingMovies.js";
import { useMovieDetails } from "./hooks/useMovieDetails.js";
import { useRecentSearches } from "./hooks/useRecentSearches.js";

const SKELETON_COUNT = 8;

function App() {
  const { recent, addRecent, clearRecent } = useRecentSearches();
  const {
    searchTerm,
    setSearchTerm,
    movieList,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    errorMessage,
  } = useMovies("", addRecent);
  const trendingMovies = useTrendingMovies();
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const {
    movie: selectedMovie,
    isLoading: isLoadingDetails,
    error: detailsError,
  } = useMovieDetails(selectedMovieId);
  const handleMovieSelect = useCallback(
    (id) => setSelectedMovieId(id),
    []
  );

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="Hero banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Love
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {recent.length > 0 && (
            <div className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-2">
              <span className="text-xs uppercase tracking-wide text-light-200/60">
                Recent
              </span>
              {recent.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearchTerm(term)}
                  className="rounded-full bg-light-100/10 px-3 py-1 text-xs text-light-200 transition hover:bg-light-100/20 focus:outline-none focus:ring-2 focus:ring-light-100/40"
                >
                  {term}
                </button>
              ))}
              <button
                type="button"
                onClick={clearRecent}
                className="text-xs text-light-200/60 transition hover:text-light-200 focus:outline-none focus:ring-2 focus:ring-light-100/40"
              >
                Clear
              </button>
            </div>
          )}
        </header>
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Searches</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li
                  key={movie.$id}
                  title={movie.searchTerm}
                  onClick={() => setSearchTerm(movie.searchTerm)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSearchTerm(movie.searchTerm);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Search for ${movie.searchTerm}`}
                  className="cursor-pointer rounded-lg transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-100/40"
                >
                  <p>{index + 1}</p>
                  <img
                    src={movie.poster_url}
                    alt={movie.searchTerm}
                    loading="lazy"
                    decoding="async"
                    className="bg-dark-100"
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All movies</h2>
          {isLoading ? (
            <ul aria-label="Loading movies" aria-busy="true">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </ul>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : movieList.length === 0 ? (
            <EmptyState searchTerm={searchTerm} />
          ) : (
            <>
              <ul>
                {movieList.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onSelect={handleMovieSelect}
                  />
                ))}
              </ul>
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="rounded-lg bg-light-100/10 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-light-100/20 focus:outline-none focus:ring-2 focus:ring-light-100/40 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoadingMore ? "Loading…" : "Load more"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <Modal
        open={!!selectedMovieId}
        onClose={() => setSelectedMovieId(null)}
        label="Movie details"
      >
        {isLoadingDetails ? (
          <div className="p-12 text-center text-light-200">Loading details…</div>
        ) : detailsError ? (
          <div className="p-12 text-center text-red-500">{detailsError}</div>
        ) : selectedMovie ? (
          <MovieDetails
            movie={selectedMovie}
            onClose={() => setSelectedMovieId(null)}
          />
        ) : null}
      </Modal>
    </main>
  );
}

export default App;
