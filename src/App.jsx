import { useState, useEffect } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import {useDebounce} from "react-use";
import {updateSearchCount, getTrendingMovies} from "./services/appwrite.js";
import {fetchMovies} from "./services/tmdb.js";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

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

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    }
    catch (error) {
        console.error("Error loading trending movies:", error);
    }
  }
  useEffect(() => {
    loadMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

    useEffect(() => {
        loadTrendingMovies();
    }, []);
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
                    <li key={movie.$id} title={movie.searchTerm}>
                        <p>{index + 1}</p>
                      <img
                          src={movie.poster_url}
                          alt={movie.searchTerm}

                      />
                    </li>
                ))}
            </ul>
        </section>
        )}

        <section className="all-movies">
          <h2>All movies</h2>
          {isLoading ? (
              <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
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
