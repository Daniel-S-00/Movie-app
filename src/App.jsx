import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import Search from "./components/Search";
import SkeletonCard from "./components/SkeletonCard";
import MovieCard from "./components/MovieCard";
import Modal from "./components/Modal";
import EmptyState from "./components/EmptyState";
import ThemeToggle from "./components/ThemeToggle.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import { useMovies } from "./hooks/useMovies.js";
import { useTrendingMovies } from "./hooks/useTrendingMovies.js";
import { useMovieDetails } from "./hooks/useMovieDetails.js";
import { useRecentSearches } from "./hooks/useRecentSearches.js";
import { useTheme } from "./hooks/useTheme.js";

const MovieDetails = lazy(() => import("./components/MovieDetails.jsx"));

const SKELETON_COUNT = 8;

function App() {
  const { recent, addRecent, clearRecent } = useRecentSearches();
  const { theme, toggleTheme } = useTheme();
  const {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
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

  useEffect(() => {
    const base = "Movie App";
    document.title = searchTerm
      ? `${base} — ${searchTerm}`
      : `${base} — Discover Films You'll Love`;
  }, [searchTerm]);

  return (
    <main>
      <LoadingScreen />
      <div className="pattern" />
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
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
              <ul key={debouncedSearchTerm} className="animate-fade-in-up">
                {movieList.map((movie, index) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onSelect={handleMovieSelect}
                    style={{ "--enter-delay": `${Math.min(index, 12) * 0.05}s` }}
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
          <Suspense
            fallback={
              <div className="p-12 text-center text-light-200">Loading…</div>
            }
          >
            <MovieDetails
              movie={selectedMovie}
              onClose={() => setSelectedMovieId(null)}
            />
          </Suspense>
        ) : null}
      </Modal>
    </main>
  );
}

export default App;
