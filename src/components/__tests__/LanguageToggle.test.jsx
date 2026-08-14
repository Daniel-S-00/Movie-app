import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LanguageToggle from "../LanguageToggle.jsx";

const renderToggle = (props) =>
  render(
    <LanguageToggle language="en-US" onLanguageChange={vi.fn()} {...props} />
  );

describe("LanguageToggle", () => {
  it("renders the globe button with the current language code", () => {
    renderToggle({ language: "es-MX" });
    const button = screen.getByRole("button", {
      name: /choose display language/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("ES");
  });

  it("opens a menu with every curated language on click", () => {
    renderToggle();
    fireEvent.click(
      screen.getByRole("button", { name: /choose display language/i })
    );
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem")).toHaveLength(12);
    expect(
      screen.getByRole("menuitem", { name: "Español" })
    ).toBeInTheDocument();
  });

  it("marks the active language as selected", () => {
    renderToggle({ language: "fr-FR" });
    fireEvent.click(
      screen.getByRole("button", { name: /choose display language/i })
    );
    const active = screen.getByRole("menuitem", { name: "Français" });
    expect(active.className).toContain("font-semibold");
  });

  it("calls onLanguageChange and closes the menu when a language is chosen", () => {
    const onLanguageChange = vi.fn();
    renderToggle({ onLanguageChange });
    fireEvent.click(
      screen.getByRole("button", { name: /choose display language/i })
    );
    fireEvent.click(screen.getByRole("menuitem", { name: "日本語" }));

    expect(onLanguageChange).toHaveBeenCalledWith("ja-JP");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes the menu when clicking outside", () => {
    renderToggle();
    fireEvent.click(
      screen.getByRole("button", { name: /choose display language/i })
    );
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes the menu on Escape", () => {
    renderToggle();
    fireEvent.click(
      screen.getByRole("button", { name: /choose display language/i })
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
