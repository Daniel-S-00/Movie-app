import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MovieDetails from "../MovieDetails.jsx";

const baseMovie = {
  id: 603,
  title: "The Matrix",
  backdrop_path: "/matrix-backdrop.jpg",
  poster_path: "/matrix-poster.jpg",
  release_date: "1999-03-31",
  runtime: 136,
  vote_average: 8.7,
  vote_count: 20000,
  genres: [{ id: 28, name: "Action" }],
  overview: "A hacker discovers reality is a simulation.",
};

const trailerVideos = [
  { site: "YouTube", type: "Trailer", key: "vKQi3bBA1y8" },
  { site: "YouTube", type: "Featurette", key: "otherKey" },
];

describe("MovieDetails", () => {
  it("renders the movie metadata", () => {
    render(<MovieDetails movie={baseMovie} onClose={vi.fn()} />);
    expect(screen.getByText("The Matrix")).toBeInTheDocument();
    expect(screen.getByText("1999")).toBeInTheDocument();
    expect(screen.getByText(/136 min/)).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("shows a play button when a YouTube trailer exists", () => {
    render(
      <MovieDetails movie={baseMovie} videos={trailerVideos} onClose={vi.fn()} />
    );
    expect(
      screen.getByRole("button", { name: "Play The Matrix trailer" })
    ).toBeInTheDocument();
  });

  it("does not show a play button when there is no YouTube video", () => {
    render(<MovieDetails movie={baseMovie} videos={[]} onClose={vi.fn()} />);
    expect(
      screen.queryByRole("button", { name: /play the matrix trailer/i })
    ).not.toBeInTheDocument();
  });

  it("embeds the trailer iframe when the play button is clicked", () => {
    render(
      <MovieDetails movie={baseMovie} videos={trailerVideos} onClose={vi.fn()} />
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Play The Matrix trailer" })
    );
    const iframe = screen.getByTitle("Play The Matrix trailer");
    expect(iframe).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/vKQi3bBA1y8?autoplay=1&rel=0"
    );
    expect(iframe).toHaveAttribute("allowFullScreen");
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(<MovieDetails movie={baseMovie} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalled();
  });
});
