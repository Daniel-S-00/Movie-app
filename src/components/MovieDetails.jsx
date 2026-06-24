function MovieDetails({ movie, onClose }) {
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-light-100/40"
      >
        <span aria-hidden="true" className="text-xl leading-none">×</span>
      </button>

      {backdropUrl ? (
        <div
          className="aspect-video w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${backdropUrl})` }}
          role="img"
          aria-label={`${movie.title} backdrop`}
        />
      ) : posterUrl ? (
        <div className="flex justify-center bg-dark-100 p-6">
          <img
            src={posterUrl}
            alt={`${movie.title} poster`}
            className="h-48 w-auto rounded-lg object-cover"
          />
        </div>
      ) : null}

      <div className="p-6">
        <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
          {movie.title}
        </h2>

        {movie.tagline && (
          <p className="mb-4 italic text-light-200">{movie.tagline}</p>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-100">
          {movie.release_date && (
            <span>{movie.release_date.split("-")[0]}</span>
          )}
          {movie.runtime > 0 && <span>• {movie.runtime} min</span>}
          {movie.vote_average > 0 && (
            <span>
              • <span className="text-yellow-400">★</span>{" "}
              {movie.vote_average.toFixed(1)} ({movie.vote_count.toLocaleString()}{" "}
              votes)
            </span>
          )}
        </div>

        {movie.genres?.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="rounded-full bg-light-100/10 px-3 py-1 text-xs text-light-200"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}

        {movie.overview && (
          <div>
            <h3 className="mb-2 font-semibold text-white">Overview</h3>
            <p className="leading-relaxed text-light-200">{movie.overview}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;
