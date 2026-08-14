import { useState } from "react";
import { useI18n } from "../i18n/I18nContext.js";

const YOUTUBE_EMBED_URL = "https://www.youtube-nocookie.com/embed";

function getTrailerKey(videos = []) {
  const youtubeVideos = videos.filter((video) => video.site === "YouTube");
  return (
    youtubeVideos.find((video) => video.type === "Trailer")?.key ??
    youtubeVideos[0]?.key
  );
}

function MovieDetails({ movie, videos, onClose }) {
  const { t } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;
  const trailerKey = getTrailerKey(videos);
  const showPlayer = isPlaying && trailerKey;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClose}
        aria-label={t("details.close")}
        className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-light-100/40"
      >
        <span aria-hidden="true" className="text-xl leading-none">×</span>
      </button>

      {backdropUrl || showPlayer ? (
        <div className="relative aspect-video w-full bg-dark-100">
          {showPlayer ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`${YOUTUBE_EMBED_URL}/${trailerKey}?autoplay=1&rel=0`}
              title={t("details.playTrailer", { title: movie.title })}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${backdropUrl})` }}
                role="img"
                aria-label={`${movie.title} backdrop`}
              />
              {trailerKey && (
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  aria-label={t("details.playTrailer", { title: movie.title })}
                  className="absolute inset-0 flex items-center justify-center bg-black/25 transition hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-light-100/40"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-2xl text-dark-100 shadow-2xl transition hover:scale-110"
                  >
                    ▶
                  </span>
                </button>
              )}
            </>
          )}
        </div>
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
            <h3 className="mb-2 font-semibold text-white">
              {t("details.overview")}
            </h3>
            <p className="leading-relaxed text-light-200">{movie.overview}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;
