import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Search from "../Search.jsx";

describe("Search", () => {
  it("renders an input with the current searchTerm", () => {
    render(<Search searchTerm="matrix" setSearchTerm={() => {}} />);
    expect(screen.getByRole("searchbox")).toHaveValue("matrix");
  });

  it("calls setSearchTerm when the user types", async () => {
    const setSearchTerm = vi.fn();
    const user = userEvent.setup();

    render(<Search searchTerm="" setSearchTerm={setSearchTerm} />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "batman");

    expect(setSearchTerm).toHaveBeenCalled();
    expect(setSearchTerm).toHaveBeenLastCalledWith("n");
  });

  it("renders a search role form with the search input inside", () => {
    render(<Search searchTerm="" setSearchTerm={() => {}} />);
    expect(screen.getByRole("search")).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("has an accessible label", () => {
    render(<Search searchTerm="" setSearchTerm={() => {}} />);
    expect(
      screen.getByRole("searchbox", { name: /search for movies/i })
    ).toBeInTheDocument();
  });

  it("prevents default form submission on Enter", () => {
    render(<Search searchTerm="" setSearchTerm={() => {}} />);
    const form = screen.getByRole("search");
    const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
    fireEvent(form, submitEvent);
    expect(submitEvent.defaultPrevented).toBe(true);
  });
});
