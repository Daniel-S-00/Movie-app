import Search from "./components/Search";
import SkeletonCard from "./components/SkeletonCard";
import MovieCard from "./components/MovieCard";
import EmptyState from "./components/EmptyState";
import { useMovies } from "./hooks/useMovies.js";
import { useTrendingMovies } from "./hooks/useTrendingMovies.js";

const SKELETON_COUNT = 8;

function App() {
  const { searchTerm, setSearchTerm, movieList, isLoading, errorMessage } =
    useMovies();
  const trendingMovies = useTrendingMovies();

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
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
