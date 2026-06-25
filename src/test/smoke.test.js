import { describe, it, expect } from "vitest";

describe("smoke", () => {
  it("test runner works", () => {
    expect(1 + 1).toBe(2);
  });

  it("jest-dom matchers are loaded", () => {
    document.body.innerHTML = "<button>Click me</button>";
    const button = document.querySelector("button");
    expect(button).toBeInTheDocument();
  });
});
