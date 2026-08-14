import { memo, useEffect, useRef } from "react";
import { useI18n } from "../i18n/I18nContext.js";

const MAX_TILT = 14;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function MovieComponent({ movie, onSelect, style }) {
  const { title, vote_average, poster_path, release_date, original_language } =
    movie;
  const { t } = useI18n();
  const ref = useRef(null);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const handleClick = () => onSelect?.(movie.id);

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && onSelect) {
      e.preventDefault();
      onSelect(movie.id);
    }
  };

  const handleMouseMove = (e) => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      el.style.setProperty("--rx", `${(0.5 - py) * MAX_TILT}deg`);
      el.style.setProperty("--ry", `${(px - 0.5) * MAX_TILT}deg`);
    });
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      className="movie-card cursor-pointer focus-within:ring-2 focus-within:ring-light-100/40"
      style={style}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={t("card.viewDetails", { title })}
    >
      <span className="card-spotlight" aria-hidden="true" />
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "/no-movie.png"
        }
        alt={title}
        loading="lazy"
        decoding="async"
        className="bg-dark-100"
      />
      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star icon" />
            <p>{vote_average ? vote_average.toFixed(1) : t("common.na")}</p>
          </div>
          <span>•</span>
          <p className="lang">{original_language}</p>
          <span>•</span>
          <p className="year">
            {release_date ? release_date.split("-")[0] : t("common.na")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default memo(MovieComponent);
