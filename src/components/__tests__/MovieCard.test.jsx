import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MovieComponent from "../MovieCard.jsx";

const baseMovie = {
  id: 1,
  title: "Inception",
  vote_average: 8.4,
  poster_path: "/abc123.jpg",
  release_date: "2010-07-15",
  original_language: "en",
};

describe("MovieCard", () => {
  it("renders the title, rating, language, and year", () => {
    render(<MovieComponent movie={baseMovie} />);
    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("8.4")).toBeInTheDocument();
    expect(screen.getByText("en")).toBeInTheDocument();
    expect(screen.getByText("2010")).toBeInTheDocument();
  });

  it("uses the TMDB poster URL when poster_path is present", () => {
    render(<MovieComponent movie={baseMovie} />);
    const img = screen.getByRole("img", { name: "Inception" });
    expect(img).toHaveAttribute(
      "src",
      "https://image.tmdb.org/t/p/w500//abc123.jpg"
    );
  });

  it("falls back to /no-movie.png when poster_path is missing", () => {
    render(
      <MovieComponent
        movie={{ ...baseMovie, poster_path: null, title: "Mystery" }}
      />
    );
    const img = screen.getByRole("img", { name: "Mystery" });
    expect(img.src).toContain("/no-movie.png");
  });

  it("shows N/A for missing rating and year", () => {
    render(
      <MovieComponent
        movie={{
          ...baseMovie,
          vote_average: 0,
          release_date: "",
          title: "Unknown",
        }}
      />
    );
    const nAElements = screen.getAllByText("N/A");
    expect(nAElements).toHaveLength(2);
  });

  it("calls onSelect with the movie id when clicked", () => {
    const onSelect = vi.fn();
    render(<MovieComponent movie={baseMovie} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole("button", { name: /view details for/i }));

    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it("calls onSelect on Enter key press", () => {
    const onSelect = vi.fn();
    render(<MovieComponent movie={baseMovie} onSelect={onSelect} />);

    fireEvent.keyDown(screen.getByRole("button"), {
      key: "Enter",
    });

    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it("has a descriptive aria-label", () => {
    render(<MovieComponent movie={baseMovie} />);
    expect(
      screen.getByRole("button", { name: "View details for Inception" })
    ).toBeInTheDocument();
  });
});
